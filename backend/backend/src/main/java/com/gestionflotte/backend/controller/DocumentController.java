package com.gestionflotte.backend.controller;

import com.gestionflotte.backend.entity.Document;
import com.gestionflotte.backend.entity.Vehicule;
import com.gestionflotte.backend.repository.DocumentRepository;
import com.gestionflotte.backend.repository.VehiculeRepository;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.List;

@RestController
@RequestMapping("/api/documents")
@CrossOrigin("*")
public class DocumentController {

    private final DocumentRepository documentRepo;
    private final VehiculeRepository vehiculeRepo;

    public DocumentController(
            DocumentRepository documentRepo,
            VehiculeRepository vehiculeRepo
    ) {
        this.documentRepo = documentRepo;
        this.vehiculeRepo = vehiculeRepo;
    }

    @GetMapping
    public List<Document> getAll() {
        return documentRepo.findAll();
    }

    @GetMapping("/vehicule/{vehiculeId}")
    public List<Document> getByVehicule(@PathVariable Long vehiculeId) {
        return documentRepo.findByVehiculeId(vehiculeId);
    }

    @PostMapping("/upload")
    public Document upload(
            @RequestParam("vehiculeId") Long vehiculeId,
            @RequestParam("type") String type,
            @RequestParam("file") MultipartFile file
    ) throws Exception {

        System.out.println("DOCUMENT UPLOAD START");

        // 1. Vérifier véhicule
        Vehicule vehicule = vehiculeRepo.findById(vehiculeId)
                .orElseThrow(() -> new RuntimeException("Vehicule NOT FOUND"));

        // 2. Chemin absolu comme PhotoController
        String uploadDir = System.getProperty("user.dir") + "/uploads/documents/";
        File dir = new File(uploadDir);

        if (!dir.exists()) {
            dir.mkdirs();
        }

        // 3. Nom du fichier
        String originalName = file.getOriginalFilename();

        if (originalName == null || originalName.isBlank()) {
            throw new RuntimeException("Nom de fichier invalide");
        }

        String fileName = System.currentTimeMillis() + "_" +
                originalName.replace(" ", "_");

        String fullPath = uploadDir + fileName;

        // 4. Sauvegarde physique du fichier
        file.transferTo(new File(fullPath));

        // 5. Sauvegarde en base
        Document d = new Document();
        d.setType(type);
        d.setFichier("uploads/documents/" + fileName);
        d.setVehicule(vehicule);

        return documentRepo.save(d);
    }

    @DeleteMapping("/{id}")
    public void deleteDocument(@PathVariable Long id) {

        Document document = documentRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Document NOT FOUND"));

        String filePath = System.getProperty("user.dir")
                + File.separator
                + document.getFichier().replace("/", File.separator);

        File file = new File(filePath);

        if (file.exists() && file.isFile()) {
            file.delete();
        }

        documentRepo.delete(document);
    }
}