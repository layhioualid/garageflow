package com.gestionflotte.backend.service;

import com.gestionflotte.backend.entity.Client;
import com.gestionflotte.backend.entity.Facture;
import com.gestionflotte.backend.entity.Intervention;
import com.gestionflotte.backend.entity.Vehicule;
import com.gestionflotte.backend.repository.FactureRepository;
import com.gestionflotte.backend.repository.InterventionRepository;

import com.itextpdf.text.BaseColor;
import com.itextpdf.text.Document;
import com.itextpdf.text.Element;
import com.itextpdf.text.Font;
import com.itextpdf.text.PageSize;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.Phrase;
import com.itextpdf.text.Rectangle;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;
import java.util.List;
import java.time.LocalDate;

@Service
public class FactureService {

    private final FactureRepository factureRepo;
    private final InterventionRepository interventionRepo;
    private final JavaMailSender mailSender;

    public FactureService(
            FactureRepository factureRepo,
            InterventionRepository interventionRepo,
            JavaMailSender mailSender
    ) {
        this.factureRepo = factureRepo;
        this.interventionRepo = interventionRepo;
        this.mailSender = mailSender;
    }

    private void addHeaderCell(PdfPTable table, String text, BaseColor color) {
        Font font = new Font(Font.FontFamily.HELVETICA, 10, Font.BOLD, BaseColor.WHITE);

        PdfPCell cell = new PdfPCell(new Phrase(text, font));
        cell.setBackgroundColor(color);
        cell.setPadding(10);
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);

        table.addCell(cell);
    }

    private void addBodyCell(PdfPTable table, String text, BaseColor color) {
        Font font = new Font(Font.FontFamily.HELVETICA, 10);

        PdfPCell cell = new PdfPCell(new Phrase(text, font));
        cell.setBackgroundColor(color);
        cell.setPadding(10);
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);

        table.addCell(cell);
    }

    private void addTotalCell(PdfPTable table, String label, String value, boolean total) {
        Font font = new Font(
                Font.FontFamily.HELVETICA,
                total ? 12 : 10,
                Font.BOLD,
                total ? BaseColor.WHITE : BaseColor.BLACK
        );

        BaseColor bg = total ? new BaseColor(37, 99, 235) : new BaseColor(245, 247, 250);

        PdfPCell c1 = new PdfPCell(new Phrase(label, font));
        c1.setBackgroundColor(bg);
        c1.setPadding(10);

        PdfPCell c2 = new PdfPCell(new Phrase(value, font));
        c2.setBackgroundColor(bg);
        c2.setPadding(10);
        c2.setHorizontalAlignment(Element.ALIGN_RIGHT);

        table.addCell(c1);
        table.addCell(c2);
    }

public Facture generateFacture(Long interventionId) {

    Facture existingFacture = factureRepo.findByInterventionId(interventionId)
            .orElse(null);

    if (existingFacture != null) {
        return existingFacture;
    }

    Intervention intervention = interventionRepo.findById(interventionId)
            .orElseThrow(() -> new RuntimeException("Intervention introuvable"));

    double montantHt = intervention.getCout();
    double tva = montantHt * 0.20;
    double montantTtc = montantHt + tva;

    Facture facture = new Facture();

    String numero = "FAC-"
            + LocalDate.now().getYear()
            + "-"
            + String.format("%04d", factureRepo.count() + 1);

    facture.setNumero(numero);
    facture.setDateFacture(LocalDateTime.now());
    facture.setMontantHt(montantHt);
    facture.setTva(tva);
    facture.setMontantTtc(montantTtc);
    facture.setStatut("UNPAID");
    facture.setIntervention(intervention);

    return factureRepo.save(facture);
}

    public List<Facture> getAll() {
        return factureRepo.findAll();
    }

    public Facture updateStatut(Long id, String statut) {
        Facture facture = factureRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Facture introuvable"));

        facture.setStatut(statut);

        return factureRepo.save(facture);
    }

    public void delete(Long id) {
        factureRepo.deleteById(id);
    }

    public Facture update(Long id, Facture newF) {

        Facture f = factureRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Facture introuvable"));

        f.setNumero(newF.getNumero());

        if (newF.getDateFacture() != null) {
            f.setDateFacture(newF.getDateFacture());
        } else if (f.getDateFacture() == null) {
            f.setDateFacture(LocalDateTime.now());
        }

        f.setMontantHt(newF.getMontantHt());
        f.setTva(newF.getTva());
        f.setMontantTtc(newF.getMontantTtc());
        f.setStatut(newF.getStatut());

        if (newF.getIntervention() != null) {
            f.setIntervention(newF.getIntervention());
        }

        return factureRepo.save(f);
    }

    public Facture sendFactureToClient(Long id) {

        Facture facture = factureRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Facture introuvable"));

        Intervention intervention = facture.getIntervention();

        if (intervention == null) {
            throw new RuntimeException("Aucune intervention associée à cette facture");
        }

        Vehicule vehicule = intervention.getVehicule();

        if (vehicule == null) {
            throw new RuntimeException("Aucun véhicule associé à cette intervention");
        }

        Client client = vehicule.getClient();

        if (client == null) {
            throw new RuntimeException("Aucun client associé à ce véhicule");
        }

        if (client.getEmail() == null || client.getEmail().isBlank()) {
            throw new RuntimeException("Le client n'a pas d'adresse email");
        }

        String factureLink = "http://localhost:8080/api/factures/" + facture.getId() + "/print";

        String clientName = client.getNom() != null ? client.getNom() : "client";

        String vehiculeLabel =
                (vehicule.getMarque() != null ? vehicule.getMarque() : "") + " " +
                (vehicule.getModele() != null ? vehicule.getModele() : "");

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(client.getEmail());
        message.setSubject("Votre véhicule est prêt - GarageFlow+");

        message.setText(
                "Bonjour " + clientName + ",\n\n" +
                "Votre véhicule est prêt à être récupéré.\n\n" +
                "Véhicule : " + vehiculeLabel.trim() + "\n" +
                "Immatriculation : " + vehicule.getImmatriculation() + "\n" +
                "Intervention : " + intervention.getTypePanne() + "\n" +
                "Montant TTC : " + facture.getMontantTtc() + " DH\n\n" +
                "Vous pouvez consulter votre facture ici :\n" +
                factureLink + "\n\n" +
                "Cordialement,\n" +
                "GarageFlow+"
        );

        mailSender.send(message);

        System.out.println("====================================");
        System.out.println("EMAIL FACTURE ENVOYÉ AU CLIENT");
        System.out.println("Client : " + client.getEmail());
        System.out.println("Lien facture : " + factureLink);
        System.out.println("====================================");

        return facture;
    }

    public byte[] generatePdf(Long id) throws Exception {

        Facture f = factureRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Facture introuvable"));

        ByteArrayOutputStream out = new ByteArrayOutputStream();

        Document document = new Document(PageSize.A4, 40, 40, 40, 40);
        PdfWriter.getInstance(document, out);

        document.open();

        Font titleFont = new Font(Font.FontFamily.HELVETICA, 24, Font.BOLD, BaseColor.WHITE);
        Font headerFont = new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD, BaseColor.WHITE);
        Font boldFont = new Font(Font.FontFamily.HELVETICA, 11, Font.BOLD);
        Font normalFont = new Font(Font.FontFamily.HELVETICA, 10);
        Font smallGray = new Font(Font.FontFamily.HELVETICA, 9, Font.NORMAL, BaseColor.GRAY);

        BaseColor blue = new BaseColor(37, 99, 235);
        BaseColor dark = new BaseColor(15, 23, 42);
        BaseColor lightGray = new BaseColor(245, 247, 250);

        PdfPTable header = new PdfPTable(2);
        header.setWidthPercentage(100);
        header.setWidths(new float[]{2, 1});

        PdfPCell companyCell = new PdfPCell();
        companyCell.setBackgroundColor(dark);
        companyCell.setPadding(18);
        companyCell.setBorder(Rectangle.NO_BORDER);

        Paragraph company = new Paragraph("GarageFlow+", titleFont);
        companyCell.addElement(company);
        companyCell.addElement(new Paragraph(
                "Système de gestion de flotte",
                new Font(Font.FontFamily.HELVETICA, 10, Font.NORMAL, BaseColor.LIGHT_GRAY)
        ));
        companyCell.addElement(new Paragraph(
                "Email : contact@garageflow.com",
                new Font(Font.FontFamily.HELVETICA, 9, Font.NORMAL, BaseColor.LIGHT_GRAY)
        ));
        companyCell.addElement(new Paragraph(
                "Téléphone : +212 6 00 00 00 00",
                new Font(Font.FontFamily.HELVETICA, 9, Font.NORMAL, BaseColor.LIGHT_GRAY)
        ));

        PdfPCell invoiceCell = new PdfPCell();
        invoiceCell.setBackgroundColor(blue);
        invoiceCell.setPadding(18);
        invoiceCell.setBorder(Rectangle.NO_BORDER);
        invoiceCell.setHorizontalAlignment(Element.ALIGN_RIGHT);

        Paragraph invoiceTitle = new Paragraph("FACTURE", titleFont);
        invoiceTitle.setAlignment(Element.ALIGN_RIGHT);
        invoiceCell.addElement(invoiceTitle);

        Paragraph invoiceNo = new Paragraph(
                "N° " + f.getNumero(),
                new Font(Font.FontFamily.HELVETICA, 10, Font.BOLD, BaseColor.WHITE)
        );
        invoiceNo.setAlignment(Element.ALIGN_RIGHT);
        invoiceCell.addElement(invoiceNo);

        header.addCell(companyCell);
        header.addCell(invoiceCell);
        document.add(header);

        document.add(new Paragraph(" "));

        PdfPTable info = new PdfPTable(2);
        info.setWidthPercentage(100);
        info.setWidths(new float[]{1, 1});

        PdfPCell leftInfo = new PdfPCell();
        leftInfo.setPadding(12);
        leftInfo.setBorderColor(new BaseColor(220, 220, 220));

        leftInfo.addElement(new Paragraph("Informations facture", boldFont));
        leftInfo.addElement(new Paragraph("Date : " + f.getDateFacture(), normalFont));
        leftInfo.addElement(new Paragraph("Statut : " + f.getStatut(), normalFont));
        leftInfo.addElement(new Paragraph("Intervention : #" + f.getIntervention().getId(), normalFont));

        PdfPCell rightInfo = new PdfPCell();
        rightInfo.setPadding(12);
        rightInfo.setBorderColor(new BaseColor(220, 220, 220));

        rightInfo.addElement(new Paragraph("Client / Véhicule", boldFont));

        if (f.getIntervention().getVehicule() != null) {
            Vehicule vehicule = f.getIntervention().getVehicule();
            Client client = vehicule.getClient();

            if (client != null) {
                rightInfo.addElement(new Paragraph(
                        "Client : " +
                        ((client.getNom() != null ? client.getNom() : "") + " " +
                        (client.getPrenom() != null ? client.getPrenom() : "")).trim(),
                        normalFont
                ));
            }

            rightInfo.addElement(new Paragraph(
                    "Véhicule : " +
                    vehicule.getMarque() + " " + vehicule.getModele(),
                    normalFont
            ));

            rightInfo.addElement(new Paragraph(
                    "Immatriculation : " + vehicule.getImmatriculation(),
                    normalFont
            ));
        }

        info.addCell(leftInfo);
        info.addCell(rightInfo);
        document.add(info);

        document.add(new Paragraph(" "));

        PdfPTable interventionTable = new PdfPTable(1);
        interventionTable.setWidthPercentage(100);

        PdfPCell sectionTitle = new PdfPCell(new Phrase("Détails de l'intervention", headerFont));
        sectionTitle.setBackgroundColor(dark);
        sectionTitle.setPadding(10);
        sectionTitle.setBorder(Rectangle.NO_BORDER);
        interventionTable.addCell(sectionTitle);

        PdfPCell details = new PdfPCell();
        details.setPadding(12);
        details.setBorderColor(new BaseColor(220, 220, 220));

        details.addElement(new Paragraph("Type panne : " + f.getIntervention().getTypePanne(), normalFont));
        details.addElement(new Paragraph("Description : " + f.getIntervention().getDescription(), normalFont));
        details.addElement(new Paragraph(
                "Technicien : " +
                (f.getIntervention().getTechnicien() != null
                        ? f.getIntervention().getTechnicien().getNom()
                        : "-"),
                normalFont
        ));

        interventionTable.addCell(details);
        document.add(interventionTable);

        document.add(new Paragraph(" "));

        if (f.getIntervention().getPieces() != null
                && !f.getIntervention().getPieces().isEmpty()) {

            Paragraph piecesTitle = new Paragraph(
                    "Pièces utilisées",
                    new Font(Font.FontFamily.HELVETICA, 14, Font.BOLD)
            );

            piecesTitle.setSpacingAfter(10);
            document.add(piecesTitle);

            PdfPTable piecesTable = new PdfPTable(4);
            piecesTable.setWidthPercentage(100);
            piecesTable.setWidths(new float[]{4, 1, 2, 2});

            addHeaderCell(piecesTable, "Pièce", dark);
            addHeaderCell(piecesTable, "Qté", dark);
            addHeaderCell(piecesTable, "Prix U.", dark);
            addHeaderCell(piecesTable, "Total", dark);

            double totalPieces = 0;
            boolean even = false;

            for (var lp : f.getIntervention().getPieces()) {

                if (lp.getPiece() == null) continue;

                double prix = lp.getPiece().getPrix();
                int qte = lp.getQuantite();
                double totalLigne = prix * qte;

                totalPieces += totalLigne;

                BaseColor row = even
                        ? new BaseColor(248, 250, 252)
                        : BaseColor.WHITE;

                even = !even;

                addBodyCell(piecesTable, lp.getPiece().getNom(), row);
                addBodyCell(piecesTable, String.valueOf(qte), row);
                addBodyCell(piecesTable, String.format("%.2f DH", prix), row);
                addBodyCell(piecesTable, String.format("%.2f DH", totalLigne), row);
            }

            document.add(piecesTable);
            document.add(new Paragraph(" "));

            Paragraph totalPiecesText = new Paragraph(
                    "Total pièces : " + String.format("%.2f DH", totalPieces),
                    new Font(Font.FontFamily.HELVETICA, 11, Font.BOLD, blue)
            );

            totalPiecesText.setAlignment(Element.ALIGN_RIGHT);
            document.add(totalPiecesText);
            document.add(new Paragraph(" "));
        }

        PdfPTable table = new PdfPTable(4);
        table.setWidthPercentage(100);
        table.setWidths(new float[]{3, 1, 1, 1});

        addHeaderCell(table, "Description", dark);
        addHeaderCell(table, "HT", dark);
        addHeaderCell(table, "TVA", dark);
        addHeaderCell(table, "TTC", dark);

        addBodyCell(table, "Intervention mécanique #" + f.getIntervention().getId(), lightGray);
        addBodyCell(table, String.format("%.2f DH", f.getMontantHt()), lightGray);
        addBodyCell(table, String.format("%.2f DH", f.getTva()), lightGray);
        addBodyCell(table, String.format("%.2f DH", f.getMontantTtc()), lightGray);

        document.add(table);

        document.add(new Paragraph(" "));

        PdfPTable totalTable = new PdfPTable(2);
        totalTable.setWidthPercentage(45);
        totalTable.setHorizontalAlignment(Element.ALIGN_RIGHT);

        addTotalCell(totalTable, "Montant HT", String.format("%.2f DH", f.getMontantHt()), false);
        addTotalCell(totalTable, "TVA", String.format("%.2f DH", f.getTva()), false);
        addTotalCell(totalTable, "TOTAL TTC", String.format("%.2f DH", f.getMontantTtc()), true);

        document.add(totalTable);

        document.add(new Paragraph(" "));

        Paragraph footer = new Paragraph(
                "Merci pour votre confiance.\nFacture générée automatiquement par GarageFlow+.",
                smallGray
        );

        footer.setAlignment(Element.ALIGN_CENTER);
        document.add(footer);

        document.close();

        return out.toByteArray();
    }
}