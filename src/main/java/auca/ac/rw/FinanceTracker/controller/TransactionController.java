package auca.ac.rw.FinanceTracker.controller;

import java.util.*;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import auca.ac.rw.FinanceTracker.model.Transaction;
import auca.ac.rw.FinanceTracker.service.TransactionService;

@RestController
@RequestMapping(value = "/transaction")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    @PostMapping(value = "/saveTransaction", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> saveTransaction(@RequestBody Transaction transaction) {
        String response = transactionService.saveTransaction(transaction);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping(value = "/getTransactionById/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getTransactionById(@PathVariable UUID id) {
        Optional<Transaction> transaction = transactionService.getTransactionById(id);
        if (transaction.isPresent()) {
            return new ResponseEntity<>(transaction.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Transaction not found", HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping(value = "/getTransactionsByAccount/{accountId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getTransactionsByAccount(@PathVariable UUID accountId) {
        List<Transaction> transactions = transactionService.getTransactionsByAccount(accountId);
        if (transactions.isEmpty()) {
            return new ResponseEntity<>("No transactions found for the given account", HttpStatus.NOT_FOUND);
        } else {
            return new ResponseEntity<>(transactions, HttpStatus.OK);
        }
    }

    @GetMapping(value = "/getTransactionsByCategory/{categoryId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getTransactionsByCategory(@PathVariable UUID categoryId) {
        try {
            List<Transaction> transactions = transactionService.getTransactionsByCategory(categoryId);
            if (transactions.isEmpty()) {
                return new ResponseEntity<>("No transactions found for the given category", HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<>(transactions, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping(value = "/getTransactionsByUser/{userId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getTransactionsByUser(@PathVariable UUID userId) {
    List<Transaction> transactions = transactionService.getTransactionsByUser(userId);
    if (transactions.isEmpty()) {
        return new ResponseEntity<>("No transactions found for the user", HttpStatus.NOT_FOUND);
    }
    return new ResponseEntity<>(transactions, HttpStatus.OK);
}

    
    @DeleteMapping(value = "/deleteTransaction/{id}")
    public ResponseEntity<?> deleteTransaction(@PathVariable UUID id) {
        String response = transactionService.deleteTransaction(id);
        if (response.equalsIgnoreCase("Transaction deleted successfully")) {
            return new ResponseEntity<>(response, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
    }
    @PutMapping(value = "/updateTransaction/{id}")
public ResponseEntity<?> updateTransaction(@PathVariable UUID id, @RequestBody Transaction transaction) {
    String result = transactionService.updateTransaction(id, transaction);
    
    if (result.equals("Transaction updated successfully")) {
        return new ResponseEntity<>(result, HttpStatus.OK);
    } else {
        return new ResponseEntity<>(result, HttpStatus.NOT_FOUND);
    }
}

}
