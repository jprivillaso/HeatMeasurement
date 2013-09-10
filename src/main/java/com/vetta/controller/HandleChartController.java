package com.vetta.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.vetta.entities.HeatChart;
import com.vetta.repositories.HeatChartRepository;

@Controller
@RequestMapping(value="/filters")
public class HandleChartController{
	
	@Autowired
	HeatChartRepository repository;
	
	@RequestMapping(value="/temp")
	public @ResponseBody String getInfoByTemperature(@RequestParam(value="minDate") String minDate,
			@RequestParam(value="maxDate") String maxDate){
		
		return "Info By temp";
	}
	
	@RequestMapping(value="/date")
	public @ResponseBody String getInfoByDate(){
		return "Info By date";
	}
}
