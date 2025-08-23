package auca.ac.rw.FinanceTracker.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import auca.ac.rw.FinanceTracker.model.Transaction;

@Repository
public interface ITransactionRepository extends JpaRepository<Transaction, UUID> {
    List<Transaction> findByAccountAccountId(UUID accountId);
    
    @Query("SELECT DISTINCT t FROM Transaction t LEFT JOIN FETCH t.category LEFT JOIN FETCH t.user WHERE t.user.userId = :userId")
    List<Transaction> findByUser_UserId(@Param("userId") UUID userId);
    
    List<Transaction> findByCategoryCategoryId(UUID categoryId);
    
    @Query("SELECT DISTINCT t FROM Transaction t " +
           "LEFT JOIN FETCH t.category " +
           "LEFT JOIN FETCH t.user " +
           "WHERE " +
           "CASE WHEN :searchTerm IS NOT NULL " +
           "THEN LOWER(t.description) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
           "WHEN :transactionDate IS NOT NULL " +
           "THEN CAST(t.date AS date) = :transactionDate " +
           "WHEN :amount IS NOT NULL " +
           "THEN t.amount = :amount " +
           "ELSE false END")
    List<Transaction> searchTransactions(
        @Param("searchTerm") String searchTerm, 
        @Param("transactionDate") LocalDate transactionDate,
        @Param("amount") Double amount
    );
}


