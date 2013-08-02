package com.vetta.controller;

import java.util.Date;
import java.util.List;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.vetta.entities.HeatChart;
import com.vetta.repositories.HeatChartRepository;

@Controller
@RequestMapping(value = "/chart")
public class HeatChartController {

	@Autowired
	HeatChartRepository repository;

	@RequestMapping(value = "/addMeasurement") 
	public @ResponseBody void addMeasurement() {
		HeatChart chart = new HeatChart();
		chart.setTemperature(new Double(Math.random()).longValue());

		chart.setDate(new Date());
		repository.save(chart);
	}

	@RequestMapping(value = "/findMeasurement")
	public @ResponseBody HeatChart findMeasurement() {
		return repository.findOne(1L);
	}

	@RequestMapping(value="/retreiveTemp")
	public @ResponseBody List<HeatChart> retrieveTemp(){
		return repository.findAll();
	}
	
	@RequestMapping(value="/random")
	public @ResponseBody void addRandomData(){
		for (int i = 0; i < 12; i++) {
			HeatChart chart = new HeatChart();
			chart.setDate(new Date());
			chart.setTemperature(randomInteger(0, 100, new Random()));
			repository.save(chart);
		}
	}
		
	public Long randomInteger(int start, int end, Random aRandom) {
		return (long)start + (int)Math.round(Math.random() * (end - start));
	}
}
