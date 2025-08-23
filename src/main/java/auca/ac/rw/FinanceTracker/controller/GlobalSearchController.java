package auca.ac.rw.FinanceTracker.controller;

import java.util.List;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import org.springframework.web.bind.annotation.RestController;

import auca.ac.rw.FinanceTracker.model.SearchRequest;
import auca.ac.rw.FinanceTracker.service.SearchService;
@RestController
@RequestMapping(value = "/search")
public class GlobalSearchController {


@Autowired
private SearchService searchService;


@PostMapping(produces = MediaType.APPLICATION_JSON_VALUE)
public ResponseEntity<?> globalSearch(@RequestBody SearchRequest searchRequest) {
List<Object> results = searchService.searchEntities(searchRequest);
if (results.isEmpty()) {
 return new ResponseEntity<>("No results found", HttpStatus.NOT_FOUND);
 } else {
 return new ResponseEntity<>(results, HttpStatus.OK);
 }
 }
}



