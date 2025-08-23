package auca.ac.rw.FinanceTracker.controller;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import auca.ac.rw.FinanceTracker.model.Report;
import auca.ac.rw.FinanceTracker.service.ReportService;

@RestController
@RequestMapping(value = "/report")
public class ReportController {

    @Autowired
    private ReportService reportService;

    @PostMapping(value = "/saveReport", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> saveReport(@RequestBody Report report) {
        String response = reportService.saveReport(report);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping(value = "/getReportById/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getReportById(@PathVariable UUID id) {
        Optional<Report> report = reportService.getReportById(id);
        if (report.isPresent()) {
            return new ResponseEntity<>(report.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Report not found", HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping(value = "/getReportsByUser/{userId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getReportsByUser(@PathVariable UUID userId) {
        List<Report> reports = reportService.getReportsByUser(userId);
        if (reports.isEmpty()) {
            return new ResponseEntity<>("No reports found for the given user", HttpStatus.NOT_FOUND);
        } else {
            return new ResponseEntity<>(reports, HttpStatus.OK);
        }
    }

    @DeleteMapping(value = "/deleteReport/{id}")
    public ResponseEntity<?> deleteReport(@PathVariable UUID id) {
        String response = reportService.deleteReport(id);
        if (response.equalsIgnoreCase("Report deleted successfully")) {
            return new ResponseEntity<>(response, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
    }
}

