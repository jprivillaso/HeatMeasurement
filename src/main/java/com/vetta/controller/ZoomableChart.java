package com.vetta.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping(value="/zoomable")
public class ZoomableChart {

	@RequestMapping(value="/getInfo")
	public @ResponseBody void getInfo(){
		
	}
}
