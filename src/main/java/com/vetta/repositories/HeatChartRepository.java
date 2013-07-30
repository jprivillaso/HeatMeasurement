package com.vetta.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.vetta.controller.HeatChartController;

public interface HeatChartRepository extends JpaRepository<HeatChartController, Long>{

}
