package com.vetta.controller;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

public class Random {
	
	
	public static void main(String [] args){
		
		Date today, yesterday;
	    Calendar calendar;

	    today = new Date();
	    calendar = Calendar.getInstance();
	    calendar.setTime(today);
	    calendar.add(Calendar.DATE, -1);
	    yesterday = calendar.getTime();
	    
	    SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
	    
	    System.out.println("Today    : " + format.format(today.getTime()));
	    System.out.println("Yesterday: " + format.format(yesterday.getTime()));
	}
}
