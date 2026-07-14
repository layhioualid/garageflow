import pdfWorkerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";

const FIELD_TERMINATORS =
  /\s+(?:ADRESSE|NUMERO|MARQUE|CATEGORIE|TYPE|CHASSIS|CYLINDR|DATE|MUTATION|PROPRIETAIRE)\b.*$/i;

const normalizeForMatch = (value = "") =>
  String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .replace(/[|]/g, "I")
    .replace(/\s+/g, " ")
    .trim();

const cleanValue = (value = "") =>
  normalizeForMatch(value)
    .replace(/^[\s:;,.\-_=]+/, "")
    .replace(FIELD_TERMINATORS, "")
    .replace(/\s+/g, " ")
    .trim();

const findLabelValue = (lines, labels) => {
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];

    for (const label of labels) {
      const position = line.search(label);
      if (position === -1) continue;

      const matchedLabel = line.slice(position).match(label)?.[0] || "";
      const inlineValue = cleanValue(
        line.slice(position + matchedLabel.length)
      );

      if (inlineValue && inlineValue.length > 1) {
        return inlineValue;
      }

      const nextLine = cleanValue(lines[index + 1] || "");
      if (nextLine && nextLine.length > 1) {
        return nextLine;
      }
    }
  }

  return "";
};

const normalizeCategory = (category = "") => {
  const value = normalizeForMatch(category);

  if (value.includes("CYCLO") || value.includes("MOTO")) return "Motorcycle";
  if (value.includes("CAMION") || value.includes("TRUCK")) return "Truck";
  if (value.includes("FOURGON") || value.includes("VAN")) return "Van";
  if (value.includes("AUTOCAR") || value.includes("AUTOBUS") || value.includes("BUS")) {
    return "Bus";
  }
  if (value.includes("SUV") || value.includes("4X4")) return "SUV";
  if (value.includes("VOITURE") || value.includes("AUTOMOBILE")) return "Car";

  return "";
};

export const parseVehicleDocumentText = (rawText) => {
  const normalizedText = String(rawText || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .replace(/[|]/g, "I")
    .replace(/\r/g, "")
    .replace(/[ \t]+/g, " ")
    .trim();
  const lines = normalizedText
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);

  const owner = findLabelValue(lines, [
    /NOM\s+ET\s+PRENOM(?:S)?\s+DU\s+PROPRIETAIRE/i,
    /PROPRIETAIRE/i,
    /PROPT\s+TALE/i,
  ]);

  const marque = findLabelValue(lines, [/MARQU(?:E|[A-Z]{1,3})/i, /BRAND/i]);
  const category = findLabelValue(lines, [/CATEGORIE/i, /CATEGORY/i]);

  const cylinderFromLabel = findLabelValue(lines, [
    /CYLINDREE(?:\s+PUISSANCE)?/i,
    /CYLINDER/i,
  ]);
  const engineSize = cylinderFromLabel.match(/\b\d{2,5}(?:[.,]\d+)?\b/)?.[0]?.replace(",", ".") || "";

  const registrationFromLabel = findLabelValue(lines, [
    /IMMATRICULATION/i,
    /REGISTRATION/i,
  ]);

  const mileageFromLabel = findLabelValue(lines, [
    /KILOMETRAGE/i,
    /ODOMETRE/i,
    /MILEAGE/i,
  ]);
  const kilometrage = mileageFromLabel
    .replace(/[^0-9]/g, "")
    .match(/\d{1,8}/)?.[0] || "";

  const fuelFromLabel = findLabelValue(lines, [
    /CARBURANT/i,
    /ENERGIE/i,
    /FUEL/i,
  ]);
  const normalizedFuel = normalizeForMatch(fuelFromLabel);
  const carburant = normalizedFuel.includes("DIESEL")
    ? "Diesel"
    : normalizedFuel.includes("ELECT")
    ? "Electric"
    : normalizedFuel.includes("ESSENCE") || normalizedFuel.includes("PETROL")
    ? "Petrol"
    : "";

  const transmissionFromLabel = findLabelValue(lines, [
    /TRANSMISSION/i,
    /BOITE\s+DE\s+VITESSE/i,
    /GEARBOX/i,
  ]);
  const normalizedTransmission = normalizeForMatch(transmissionFromLabel);
  const transmission = normalizedTransmission.includes("AUTO")
    ? "Automatic"
    : normalizedTransmission.includes("MANU") || normalizedTransmission.includes("MECANI")
    ? "Manual"
    : "";

  const dates = normalizedText.match(/\b\d{1,2}[/.\-]\d{1,2}[/.\-]\d{4}\b/g) || [];
  const detectedYear = Number(dates[0]?.match(/\d{4}$/)?.[0] || 0);
  const currentYear = new Date().getFullYear();
  const year =
    detectedYear >= 1950 && detectedYear <= currentYear + 1
      ? String(detectedYear)
      : "";
  const dateParts = dates[0]?.match(/(\d{1,2})[/.\-](\d{1,2})[/.\-](\d{4})/);
  const dateMiseService = year && dateParts
    ? `${dateParts[3]}-${String(dateParts[2]).padStart(2, "0")}-${String(
        dateParts[1]
      ).padStart(2, "0")}`
    : "";

  const fields = {
    immatriculation: cleanValue(registrationFromLabel),
    marque: cleanValue(marque),
    modele: normalizeCategory(category),
    annee: year,
    kilometrage,
    carburant,
    transmission,
    engineSize,
    dateMiseService,
  };

  return {
    fields: Object.fromEntries(
      Object.entries(fields).filter(([, value]) => value !== "")
    ),
    ownerName: cleanValue(owner),
  };
};

const imageFileToCanvas = async (file) => {
  const bitmap = await createImageBitmap(file);
  const maxDimension = Math.max(bitmap.width, bitmap.height);
  const scale = Math.min(2, 2400 / maxDimension);
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));

  const context = canvas.getContext("2d", { willReadFrequently: true });
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.filter = "grayscale(1) contrast(1.45) brightness(1.08)";
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  return canvas;
};

const pdfFileToCanvases = async (file) => {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

  const data = new Uint8Array(await file.arrayBuffer());
  const pdf = await pdfjs.getDocument({ data }).promise;
  const pageCount = Math.min(pdf.numPages, 2);
  const canvases = [];

  for (let pageNumber = 1; pageNumber <= pageCount; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const viewport = page.getViewport({ scale: 2.2 });
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(viewport.width);
    canvas.height = Math.round(viewport.height);
    const canvasContext = canvas.getContext("2d", { willReadFrequently: true });

    await page.render({ canvas, canvasContext, viewport }).promise;
    canvases.push(canvas);
  }

  return canvases;
};

export const extractVehicleDocument = async (file, onProgress = () => {}) => {
  if (!file) {
    throw new Error("Aucun document selectionne.");
  }

  const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
  const sources = isPdf
    ? await pdfFileToCanvases(file)
    : [await imageFileToCanvas(file)];

  onProgress({ progress: 0.08, status: "Preparation du moteur OCR" });

  const { createWorker } = await import("tesseract.js");
  let currentSourceIndex = 0;
  const worker = await createWorker(["fra", "eng"], undefined, {
    logger: (message) => {
      const sourceProgress = Number(message.progress || 0);
      const overallProgress =
        0.08 + ((currentSourceIndex + sourceProgress) / sources.length) * 0.88;

      onProgress({
        progress: Math.min(overallProgress, 0.96),
        status: message.status || "Lecture du document",
      });
    },
  });

  try {
    const texts = [];
    const confidences = [];

    for (let index = 0; index < sources.length; index += 1) {
      currentSourceIndex = index;
      const result = await worker.recognize(sources[index]);
      texts.push(result.data.text || "");
      confidences.push(Number(result.data.confidence || 0));
    }

    const rawText = texts.join("\n");
    const parsed = parseVehicleDocumentText(rawText);
    const fields = parsed.fields;
    const confidence = confidences.length
      ? confidences.reduce((sum, value) => sum + value, 0) / confidences.length
      : 0;

    onProgress({ progress: 1, status: "Extraction terminee" });

    return {
      fields,
      ownerName: parsed.ownerName,
      rawText,
      confidence: Math.round(confidence),
      detectedCount: Object.keys(fields).length,
    };
  } finally {
    await worker.terminate();
  }
};

export const normalizePersonName = (value = "") =>
  normalizeForMatch(value).replace(/[^A-Z0-9 ]/g, "").trim();
