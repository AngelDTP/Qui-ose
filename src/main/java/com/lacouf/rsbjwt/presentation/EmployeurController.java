package com.lacouf.rsbjwt.presentation;

import com.lacouf.rsbjwt.service.EmployeurService;
import com.lacouf.rsbjwt.service.dto.EmployeurDTO;
import com.lacouf.rsbjwt.service.dto.EtudiantDTO;
import com.lacouf.rsbjwt.service.dto.EvaluationStageEmployeurDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/employeur")
@CrossOrigin(origins = "http://localhost:3000")
public class EmployeurController {

    private final EmployeurService employeurService;

    public EmployeurController(EmployeurService employeurService) {
        this.employeurService = employeurService;
    }

    @PostMapping("/creerEmployeur")
    public ResponseEntity<EmployeurDTO> creerEmployeur(@RequestBody EmployeurDTO newEmployeur) {
        if (newEmployeur == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        Optional<EmployeurDTO> employeurDTO = employeurService.creerEmployeur(newEmployeur);

        return employeurDTO.map(employeur -> ResponseEntity.status(HttpStatus.CREATED).body(employeur))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.CONFLICT).build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmployeurDTO> getEmployeurById(@PathVariable Long id) {
        if(id == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        Optional<EmployeurDTO> employeurDTO = employeurService.getEmployeurById(id);

        return employeurDTO.map(employeur -> ResponseEntity.ok().body(employeur))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @PostMapping("/creerEvaluationEtudiant")
    public ResponseEntity<EvaluationStageEmployeurDTO> creerEvaluationEtudiant(@RequestBody EmployeurDTO employeur, @RequestBody EtudiantDTO etudiant, @RequestBody EvaluationStageEmployeurDTO evaluationStageEmployeur) {
        if (employeur == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
        if(etudiant == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
        if(evaluationStageEmployeur == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        Optional<EvaluationStageEmployeurDTO> evaluationStageEmployeurDTO = employeurService.creerEvaluationEtudiant(employeur, etudiant, evaluationStageEmployeur);

        return evaluationStageEmployeurDTO.map(evaluation -> ResponseEntity.status(HttpStatus.CREATED).body(evaluation))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.CONFLICT).build());
    }
}
