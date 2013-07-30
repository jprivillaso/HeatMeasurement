package com.vetta.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping(value="/graphics")
public class HeatChartController {
	
	@RequestMapping(value="/addMeasurement")
	public @ResponseBody void addMeasurement(){
		
	}
}
