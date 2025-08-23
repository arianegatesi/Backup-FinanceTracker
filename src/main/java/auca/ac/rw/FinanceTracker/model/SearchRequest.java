package auca.ac.rw.FinanceTracker.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class SearchRequest {

    private String term;
    private String entityType;
}
