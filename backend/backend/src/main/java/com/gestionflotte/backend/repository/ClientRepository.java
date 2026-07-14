package com.gestionflotte.backend.repository;

import com.gestionflotte.backend.entity.Client;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClientRepository extends JpaRepository<Client, Long> {
}
