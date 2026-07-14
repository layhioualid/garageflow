package com.gestionflotte.backend.controller;

import com.gestionflotte.backend.entity.Intervention;
import com.gestionflotte.backend.entity.Photo;
import com.gestionflotte.backend.repository.InterventionRepository;
import com.gestionflotte.backend.repository.PhotoRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.List;

@RestController
@RequestMapping("/api/photos")
@CrossOrigin("*")
public class PhotoController {

    private final PhotoRepository photoRepo;
    private final InterventionRepository interventionRepo;

    public PhotoController(PhotoRepository photoRepo,
    InterventionRepository interventionRepo) {
        this.photoRepo = photoRepo;
        this.interventionRepo = interventionRepo;
    }

    @GetMapping
    public List<Photo> getAll() {
        return photoRepo.findAll();
    }

    @PostMapping("/upload")
public Photo upload(
        @RequestParam("interventionId") Long interventionId,
        @RequestParam("type") String type,
        @RequestParam("file") MultipartFile file
) throws Exception {

    System.out.println("UPLOAD START");

    // 1. check intervention
    Intervention intervention = interventionRepo.findById(interventionId)
            .orElseThrow(() -> new RuntimeException("Intervention NOT FOUND"));

    // 2. PATH ABSOLU (IMPORTANT)
    String uploadDir = System.getProperty("user.dir") + "/uploads/photos/";
    File dir = new File(uploadDir);
    if (!dir.exists()) dir.mkdirs();

    // 3. file name
   String fileName = System.currentTimeMillis() + "_" +
        file.getOriginalFilename().replace(" ", "_");
    String fullPath = uploadDir + fileName;

    // 4. save file
    file.transferTo(new File(fullPath));

    // 5. save DB
    Photo p = new Photo();
    p.setUrl("uploads/photos/" + fileName); // URL relative pour frontend
    p.setType(type);
    p.setIntervention(intervention);

    return photoRepo.save(p);
}

@DeleteMapping("/{id}")
public void deletePhoto(@PathVariable Long id) {

    Photo photo = photoRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("Photo NOT FOUND"));

    // 🔥 chemin sécurisé
    String filePath = System.getProperty("user.dir")
            + File.separator
            + photo.getUrl().replace("/", File.separator);

    File file = new File(filePath);

    if (file.exists() && file.isFile()) {
        file.delete();
    }

    photoRepo.delete(photo);
}
}