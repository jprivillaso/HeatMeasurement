package com.vetta.controller;

import java.util.Date;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.vetta.entities.HeatChart;
import com.vetta.repositories.HeatChartRepository;

@Controller
@RequestMapping(value="/chart")
public class HeatChartController {
	
	@Autowired
	HeatChartRepository repository;
	
	@RequestMapping(value="/addMeasurement")
	public @ResponseBody void addMeasurement(){
		HeatChart chart = new HeatChart(); 
		chart.setId(3L);
		chart.setTemperature(19L);
		
		chart.setDate(new Date());
		repository.save(chart);
	}
	
	@RequestMapping(value="/findMeasurement")
	public @ResponseBody HeatChart findMeasurement(){
		return repository.findOne(1L);
	}
}
