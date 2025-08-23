package auca.ac.rw.FinanceTracker.service;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import auca.ac.rw.FinanceTracker.model.Category;
import auca.ac.rw.FinanceTracker.model.Transaction;
import auca.ac.rw.FinanceTracker.model.TransactionType;
import auca.ac.rw.FinanceTracker.repository.ICategoryRepository;
import auca.ac.rw.FinanceTracker.repository.ITransactionRepository;

@Service
public class TransactionService {

    @Autowired
    private ITransactionRepository transactionRepository;

    @Autowired
    private ICategoryRepository categoryRepository;

public String saveTransaction(Transaction transaction) {
    if (transaction.getTransactionType() == null) {
        transaction.setTransactionType(TransactionType.EXPENSE); // Default value
    }
    transaction.setDate(new Date());
    transactionRepository.save(transaction);
    return "Transaction saved successfully";
}

    public List<Transaction> getTransactionsByUser(UUID userId) {
        return transactionRepository.findByUser_UserId(userId);
    }

    public Optional<Transaction> getTransactionById(UUID transactionId) {
        return transactionRepository.findById(transactionId);
    }

    public List<Transaction> getTransactionsByAccount(UUID accountId) {
        return transactionRepository.findByAccountAccountId(accountId);
    }

    public List<Transaction> getTransactionsByCategory(UUID categoryId) {
        Optional<Category> category = categoryRepository.findById(categoryId);
    
        // Use built-in exception with a clear message
        if (category.isEmpty()) {
            throw new IllegalArgumentException("Category not found");
        }
    
        return transactionRepository.findByCategoryCategoryId(categoryId);
    }
    

    public String deleteTransaction(UUID transactionId) {
        Optional<Transaction> transaction = transactionRepository.findById(transactionId);
        if (transaction.isPresent()) {
            transactionRepository.deleteById(transactionId);
            return "Transaction deleted successfully";
        } else {
            return "Transaction not found";
        }
    }
    public String updateTransaction(UUID transactionId, Transaction updatedTransaction) {
        return transactionRepository.findById(transactionId)
                .map(existingTransaction -> {
                    existingTransaction.setAmount(updatedTransaction.getAmount());
                    existingTransaction.setDescription(updatedTransaction.getDescription());
                    existingTransaction.setCategory(updatedTransaction.getCategory());
                    existingTransaction.setDate(updatedTransaction.getDate());
                    existingTransaction.setUser(updatedTransaction.getUser());
                    existingTransaction.setTransactionType(updatedTransaction.getTransactionType());
                    
                    transactionRepository.save(existingTransaction);
                    return "Transaction updated successfully";
                })
                .orElse("Transaction not found");
    }
    
}
