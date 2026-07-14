package com.gestionflotte.backend.service;

import com.gestionflotte.backend.entity.Client;
import com.gestionflotte.backend.repository.ClientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ClientService {

    private final ClientRepository clientRepository;

    public List<Client> findAll() {
        return clientRepository.findAll();
    }

    public Client findById(Long id) {
        return clientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Client introuvable"));
    }

    public Client save(Client client) {
        return clientRepository.save(client);
    }

    public Client update(Long id, Client data) {
        Client client = findById(id);

        client.setNom(data.getNom());
        client.setPrenom(data.getPrenom());
        client.setEmail(data.getEmail());
        client.setTelephone(data.getTelephone());
        client.setAdresse(data.getAdresse());

        return clientRepository.save(client);
    }

    public void delete(Long id) {
        clientRepository.deleteById(id);
    }
}
