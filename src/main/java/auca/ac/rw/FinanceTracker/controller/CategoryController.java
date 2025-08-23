package auca.ac.rw.FinanceTracker.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import auca.ac.rw.FinanceTracker.DTO.CategoryDTO;
import auca.ac.rw.FinanceTracker.model.Category;
import auca.ac.rw.FinanceTracker.service.CategoryService;

@RestController
@RequestMapping("/category")
public class CategoryController {
    @Autowired
    private CategoryService categoryService;

    @PostMapping("/saveCategory")
    public ResponseEntity<Map<String, String>> saveCategory(@RequestBody Category category) {
        String result = categoryService.saveCategory(category);
        Map<String, String> response = new HashMap<>();
        response.put("message", result);
        
        if (result.equals("Category already exists for this user")) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/getCategoryById/{id}")
    public ResponseEntity<CategoryDTO> getCategoryById(@PathVariable UUID id) {
        return categoryService.getCategoryById(id)
            .map(category -> ResponseEntity.ok(convertToDTO(category)))
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/getCategoriesByUser/{userId}")
    public ResponseEntity<List<CategoryDTO>> getCategoriesByUser(@PathVariable UUID userId) {
        List<Category> categories = categoryService.getCategoriesByUser(userId);
        if (categories.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        List<CategoryDTO> categoryDTOs = categories.stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
        return ResponseEntity.ok(categoryDTOs);
    }

    @DeleteMapping("/deleteCategory/{id}")
    public ResponseEntity<Map<String, String>> deleteCategory(@PathVariable UUID id) {
        String result = categoryService.deleteCategory(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", result);
        
        return result.equals("Category deleted successfully") 
            ? ResponseEntity.ok(response)
            : ResponseEntity.notFound().build();
    }
    @PutMapping("/updateCategory/{id}")
    public ResponseEntity<Map<String, String>> updateCategory(@PathVariable UUID id, @RequestBody Category category) {
        String result = categoryService.updateCategory(id, category);
        Map<String, String> response = new HashMap<>();
        response.put("message", result);
        
        return result.equals("Category updated successfully") 
            ? ResponseEntity.ok(response)
            : ResponseEntity.notFound().build();
    }
    
    private CategoryDTO convertToDTO(Category category) {
        return new CategoryDTO(
            category.getCategoryId(),
            category.getName(),
            category.getDescription(),
            category.getColor()
        );
    }
}
