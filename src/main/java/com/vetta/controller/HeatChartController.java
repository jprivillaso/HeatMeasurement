package com.vetta.controller;

import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.vetta.entities.HeatChart;
import com.vetta.repositories.HeatChartRepository;

@Controller
@RequestMapping(value = "/chart")
public class HeatChartController {

	@Autowired
	HeatChartRepository repository;

	/**
	 * Add a new measurement
	 */
	@RequestMapping(value = "/addMeasurement") 
	public @ResponseBody void addMeasurement() {
		HeatChart chart = new HeatChart();
		chart.setTemperature(new Double(Math.random()).longValue());

		chart.setDate(new Date());
		repository.save(chart);
	}

	/**
	 * Find some measurement by Id
	 * @return
	 */
	@RequestMapping(value = "/findMeasurement")
	public @ResponseBody HeatChart findMeasurement(@RequestParam(value="id") int id) {
		return repository.findOne(new Long(id));
	}

	/**
	 * Retrieves all the measurements placed in the database 
	 * @return
	 */
	@RequestMapping(value="/retreiveTemp")
	public @ResponseBody List<HeatChart> retrieveTemp(){
		return repository.findAll();
	}
	
	/**
	 * Method to create random data in the database
	 */
	@RequestMapping(value="/random")
	public @ResponseBody void addRandomData(){
		
		Date today = new Date();		
		Calendar calendar = Calendar.getInstance();
		calendar.setTime(today);
				
		for (int i = 0; i < 3; i++) {
			HeatChart chart = new HeatChart();
			calendar.add(Calendar.DATE, +1);
			chart.setDate(calendar.getTime());
			chart.setTemperature(randomInteger(0, 100, new Random()));
			repository.save(chart);
		}
	}
		
	public Long randomInteger(int start, int end, Random aRandom) {
		return (long)start + (int)Math.round(Math.random() * (end - start));
	}
}
