package auca.ac.rw.FinanceTracker.service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import auca.ac.rw.FinanceTracker.model.Report;
import auca.ac.rw.FinanceTracker.repository.IReportRepository;

@Service
public class ReportService {

    @Autowired
    private IReportRepository reportRepository;

    public String saveReport(Report report) {
        reportRepository.save(report);
        return "Report saved successfully";
    }

    public Optional<Report> getReportById(UUID reportId) {
        return reportRepository.findById(reportId);
    }

    public List<Report> getReportsByUser(UUID userId) {
        return reportRepository.findByUserUserId(userId);
    }

    public String deleteReport(UUID reportId) {
        Optional<Report> report = reportRepository.findById(reportId);
        if (report.isPresent()) {
            reportRepository.deleteById(reportId);
            return "Report deleted successfully";
        } else {
            return "Report not found";
        }
    }
}

