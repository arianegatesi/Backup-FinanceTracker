package auca.ac.rw.FinanceTracker.service;



import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import auca.ac.rw.FinanceTracker.model.Category;
import auca.ac.rw.FinanceTracker.model.User;
import auca.ac.rw.FinanceTracker.repository.ICategoryRepository;
import auca.ac.rw.FinanceTracker.repository.IUserRepository;

@Service
public class CategoryService {

    @Autowired
    private ICategoryRepository categoryRepository;
    
    @Autowired
    private IUserRepository userRepository;

    public String saveCategory(Category category) {
        // First verify if the user exists
        User user = userRepository.findById(category.getUser().getUserId())
                .orElseThrow();
        
        // Set the verified user to the category
        category.setUser(user);

        Optional<Category> existingCategory = categoryRepository.findByNameAndUserUserEmail(
            category.getName(), 
            category.getUser().getUserEmail()
        );

        if (existingCategory.isPresent()) {
            return "Category already exists for this user";
        }

        categoryRepository.save(category);
        return "Category saved successfully";
    }

    public Optional<Category> getCategoryById(UUID categoryId) {
        return categoryRepository.findById(categoryId);
    }

    public List<Category> getCategoriesByUser(UUID userId) {
        // Verify user exists before fetching categories
        userRepository.findById(userId)
                .orElseThrow();
                
        return categoryRepository.findByUserUserId(userId);
    }

    public String deleteCategory(UUID categoryId) {
        return categoryRepository.findById(categoryId)
                .map(category -> {
                    categoryRepository.deleteById(categoryId);
                    return "Category deleted successfully";
                })
                .orElse("Category not found");
    }

public String updateCategory(UUID categoryId, Category updatedCategory) {
    return categoryRepository.findById(categoryId)
            .map(existingCategory -> {
                // Verify user exists
                User user = userRepository.findById(updatedCategory.getUser().getUserId())
                        .orElseThrow();
                
                existingCategory.setName(updatedCategory.getName());
                existingCategory.setDescription(updatedCategory.getDescription());
                existingCategory.setColor(updatedCategory.getColor());
                existingCategory.setUser(user);
                
                categoryRepository.save(existingCategory);
                return "Category updated successfully";
            })
            .orElse("Category not found");
}
}