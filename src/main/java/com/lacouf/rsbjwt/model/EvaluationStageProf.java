package com.lacouf.rsbjwt.model;

import com.lacouf.rsbjwt.service.dto.EvaluationStageProfDTO;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.security.access.method.P;

import java.time.LocalDate;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class EvaluationStageProf {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Professeur professeur;

    @ManyToOne
    private Etudiant etudiant;

    private String nomEntreprise;
    private String personneContact;
    private String adresse;


    private String telephone;


    // Identification du stagiaire
    private String nomStagiaire;
    private LocalDate dateStage;


    // Évaluation des tâches
    private EvaluationConformite tachesConformite;
    private EvaluationConformite accueilIntegration;
    private EvaluationConformite encadrementSuffisant;
    private int heuresEncadrementPremierMois;
    private int heuresEncadrementDeuxiemeMois;
    private int heuresEncadrementTroisiemeMois;

    private EvaluationConformite respectNormesHygiene;
    private EvaluationConformite climatDeTravail;
    private EvaluationConformite accesTransportCommun;
    private EvaluationConformite salaireInteressant;
    private double salaireHoraire;
    private EvaluationConformite communicationSuperviseur;
    private EvaluationConformite equipementAdequat;
    private EvaluationConformite volumeTravailAcceptable;

    // Observations générales
    private boolean privilegiePremierStage;
    private boolean privilegieDeuxiemeStage;
    private int nombreStagiairesAccueillis;
    private boolean souhaiteRevoirStagiaire;
    private boolean offreQuartsVariables;
    private String horairesQuartsDeTravail;

    // Commentaires et date
    private String commentaires;
    private String signatureEnseignant;
    private String dateSignature;

    public EvaluationStageProf(EvaluationStageProfDTO evaluationStageProfDTOaSave) {
        this.nomEntreprise = evaluationStageProfDTOaSave.getNomEntreprise();
        this.personneContact = evaluationStageProfDTOaSave.getPersonneContact();
        this.adresse = evaluationStageProfDTOaSave.getAdresse();

        this.telephone = evaluationStageProfDTOaSave.getTelephone();


        this.nomStagiaire = evaluationStageProfDTOaSave.getNomStagiaire();
        this.dateStage = evaluationStageProfDTOaSave.getDateStage();


        this.tachesConformite = evaluationStageProfDTOaSave.getTachesConformite();
        this.accueilIntegration = evaluationStageProfDTOaSave.getAccueilIntegration();
        this.encadrementSuffisant = evaluationStageProfDTOaSave.getEncadrementSuffisant();
        this.heuresEncadrementPremierMois = evaluationStageProfDTOaSave.getHeuresEncadrementPremierMois();
        this.heuresEncadrementDeuxiemeMois = evaluationStageProfDTOaSave.getHeuresEncadrementDeuxiemeMois();
        this.heuresEncadrementTroisiemeMois = evaluationStageProfDTOaSave.getHeuresEncadrementTroisiemeMois();

        this.respectNormesHygiene = evaluationStageProfDTOaSave.getRespectNormesHygiene();
        this.climatDeTravail = evaluationStageProfDTOaSave.getClimatDeTravail();
        this.accesTransportCommun = evaluationStageProfDTOaSave.getAccesTransportCommun();
        this.salaireInteressant = evaluationStageProfDTOaSave.getSalaireInteressant();
        this.salaireHoraire = evaluationStageProfDTOaSave.getSalaireHoraire();
        this.communicationSuperviseur = evaluationStageProfDTOaSave.getCommunicationSuperviseur();
        this.equipementAdequat = evaluationStageProfDTOaSave.getEquipementAdequat();
        this.volumeTravailAcceptable = evaluationStageProfDTOaSave.getVolumeTravailAcceptable();

        this.privilegiePremierStage = evaluationStageProfDTOaSave.isPrivilegiePremierStage();
        this.privilegieDeuxiemeStage = evaluationStageProfDTOaSave.isPrivilegieDeuxiemeStage();
        this.nombreStagiairesAccueillis = evaluationStageProfDTOaSave.getNombreStagiairesAccueillis();
        this.souhaiteRevoirStagiaire = evaluationStageProfDTOaSave.isSouhaiteRevoirStagiaire();
        this.offreQuartsVariables = evaluationStageProfDTOaSave.isOffreQuartsVariables();
        this.horairesQuartsDeTravail = evaluationStageProfDTOaSave.getHorairesQuartsDeTravail();
    }


    public enum EvaluationConformite {
        TOTAL_EN_ACCORD,
        PLUTOT_EN_ACCORD,
        PLUTOT_EN_DESACCORD,
        TOTAL_EN_DESACCORD,
        IMPOSSIBLE_SE_PRONONCER
    }
}

