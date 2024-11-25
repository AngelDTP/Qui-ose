package com.lacouf.rsbjwt.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Setter
@Getter
@NoArgsConstructor
public class Entrevue {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDateTime dateHeure;

    @Column(nullable = false)
    private String location;

    @Column(nullable = false)
    private String status;

    @ManyToOne
    @JoinColumn(name = "etudiant_id", nullable = false)
    private Etudiant etudiant;

    @ManyToOne
    @JoinColumn(name = "offre_de_stage_id", nullable = false)
    private OffreDeStage offreDeStage;

    public Entrevue(LocalDateTime dateHeure, String location, String status, Etudiant etudiant, OffreDeStage offreDeStage) {
        this.dateHeure = dateHeure;
        this.location = location;
        this.status = status;
        this.etudiant = etudiant;
        this.offreDeStage = offreDeStage;
    }

    @Override
    public String toString() {
        return "Entrevue{" +
                "id=" + (id != null ? id : "null") +
                ", dateHeure=" + (dateHeure != null ? dateHeure : "null") +
                ", location='" + (location != null ? location : "null") + '\'' +
                ", status='" + (status != null ? status : "null") + '\'' +
                ", etudiant=" + (etudiant != null ? etudiant.getEmail() : "null") +
                ", offreDeStage=" + (offreDeStage != null ? offreDeStage.getTitre() : "null") +
                '}';
    }
}
