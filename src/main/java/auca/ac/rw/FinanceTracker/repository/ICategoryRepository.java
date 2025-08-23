package auca.ac.rw.FinanceTracker.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import auca.ac.rw.FinanceTracker.model.Category;

@Repository
public interface ICategoryRepository extends JpaRepository<Category, UUID> {
    Optional<Category> findByNameAndUserUserEmail(String name, String email);
    
    List<Category> findByUserUserId(UUID userId);
     
    @Query("SELECT c FROM Category c WHERE " +
           "LOWER(c.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(c.description) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(c.color) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<Category> searchCategories(@Param("searchTerm") String searchTerm);
}

