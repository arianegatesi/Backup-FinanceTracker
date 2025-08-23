package auca.ac.rw.FinanceTracker.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import auca.ac.rw.FinanceTracker.model.SearchRequest;
import auca.ac.rw.FinanceTracker.repository.ICategoryRepository;
import auca.ac.rw.FinanceTracker.repository.IReportRepository;
import auca.ac.rw.FinanceTracker.repository.ITransactionRepository;
import auca.ac.rw.FinanceTracker.repository.IUserRepository;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;

@Service
public class SearchService {

    @Autowired
    private IUserRepository userRepository;

    @Autowired
    private ICategoryRepository categoryRepository;

    @Autowired
    private IReportRepository reportRepository;

    @Autowired
    private ITransactionRepository transactionRepository;

    public List<Object> searchEntities(SearchRequest searchRequest) {
        List<Object> results = new ArrayList<>();
        String term = searchRequest.getTerm();
        String entityType = searchRequest.getEntityType();

        switch (entityType.toLowerCase()) {
            case "user":
                results.addAll(userRepository.searchUsers(term));
                break;
            case "category":
                results.addAll(categoryRepository.searchCategories(term));
                break;
            case "report":
                try {
                    LocalDate date = LocalDate.parse(term, DateTimeFormatter.ISO_LOCAL_DATE);
                    results.addAll(reportRepository.searchReports(date));
                } catch (DateTimeParseException e) {
                    throw new IllegalArgumentException("Invalid date type: " + e.getMessage());
                }
                break;
            case "transaction":
                try {
                    LocalDate transactionDate = LocalDate.parse(term, DateTimeFormatter.ISO_LOCAL_DATE);
                    results.addAll(transactionRepository.searchTransactions(null, transactionDate, null));
                } catch (DateTimeParseException e) {
                    try {
                        Double amount = Double.parseDouble(term);
                        results.addAll(transactionRepository.searchTransactions(null, null, amount));
                    } catch (NumberFormatException ne) {
                        results.addAll(transactionRepository.searchTransactions(term, null, null));
                    }
                }
                break;
            
            default:
                throw new IllegalArgumentException("Invalid entity type: " + entityType);
        }

        return results;
    }
}
