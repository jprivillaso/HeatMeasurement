package com.vetta.repositories;

import java.util.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.vetta.entities.HeatChart;

public interface CustomQueries extends JpaRepository<HeatChart, String> {
	
	public List<HeatChart> findByDate(Date date); 
	
}
