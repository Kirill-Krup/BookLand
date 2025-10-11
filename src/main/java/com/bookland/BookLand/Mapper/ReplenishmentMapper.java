package com.bookland.BookLand.Mapper;

import com.bookland.BookLand.DTO.ReplenishmentDTOs.ReplenishmentCreateDTO;
import com.bookland.BookLand.DTO.ReplenishmentDTOs.ReplenishmentDTO;
import com.bookland.BookLand.Model.Replenishment;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = UserMapper.class)
public interface ReplenishmentMapper {
  ReplenishmentDTO toDto(Replenishment replenishment);
  Replenishment toEntity(ReplenishmentDTO dto);

  Replenishment toEntity(ReplenishmentCreateDTO dto);
}
