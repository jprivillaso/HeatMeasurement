package com.vetta.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.vetta.entities.HeatChart;
import com.vetta.repositories.HeatChartRepository;

@Controller
@RequestMapping(value="/")
public class HandleChartController{
	
	@Autowired
	HeatChartRepository repository;
	
	@RequestMapping(value="/customQuery")
	public @ResponseBody List<HeatChart> getTemperatureByDate(){
		
		
		return null;
	}
}
