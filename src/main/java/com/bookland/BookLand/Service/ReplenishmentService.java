package com.bookland.BookLand.Service;

import com.bookland.BookLand.DTO.ReplenishmentDTOs.ReplenishmentCreateDTO;
import com.bookland.BookLand.DTO.ReplenishmentDTOs.ReplenishmentDTO;

public interface ReplenishmentService {

  ReplenishmentDTO createReplenishment(String name, ReplenishmentCreateDTO replenishmentCreateDTO);
}
