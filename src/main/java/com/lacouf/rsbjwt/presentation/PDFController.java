package com.lacouf.rsbjwt.presentation;

import com.lacouf.rsbjwt.service.SystemeService;
import com.lacouf.rsbjwt.service.dto.ContratDTO;
import com.lacouf.rsbjwt.service.dto.EvaluationStageProfDTO;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/generatePDF")
@CrossOrigin(origins = "http://localhost:3000")
public class PDFController {

    private final SystemeService systemeService;

    public PDFController(SystemeService systemeService) {
        this.systemeService = systemeService;
    }

    @PostMapping("/contrat")
    public ResponseEntity<byte[]> generateContratPDF(@RequestBody ContratDTO contrat) {
        try {
            byte[] pdfBytes = systemeService.generateContratPDF(contrat);
            HttpHeaders headers = new HttpHeaders();
            headers.add("Content-Disposition", "attachment; filename=Contrat_Stage.pdf");

            return ResponseEntity.ok()
                    .headers(headers)
                    .contentType(org.springframework.http.MediaType.APPLICATION_PDF)
                    .body(pdfBytes);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/evaluationProf")
    public ResponseEntity<byte[]> generateEvaluationProfPDF(@RequestBody EvaluationStageProfDTO evaluationStageProf) {
        System.out.println("EvaluationStageProfDTO: " + evaluationStageProf);

        try {
            byte[] pdfBytes = systemeService.generateEvaluationProfPDF(evaluationStageProf);
            HttpHeaders headers = new HttpHeaders();
            headers.add("Content-Disposition", "attachment; filename=Evaluation_Stage_Prof.pdf");

            return ResponseEntity.ok()
                    .headers(headers)
                    .contentType(org.springframework.http.MediaType.APPLICATION_PDF)
                    .body(pdfBytes);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
