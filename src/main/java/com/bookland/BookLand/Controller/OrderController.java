package com.bookland.BookLand.Controller;

import com.bookland.BookLand.DTO.OrderDTOs.OrderCreateDTO;
import com.bookland.BookLand.DTO.OrderDTOs.OrderDTO;
import com.bookland.BookLand.Model.Order;
import com.bookland.BookLand.Service.OrderService;
import jakarta.transaction.Transactional;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

  private final OrderService orderService;

  @GetMapping("/allOrders")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<List<OrderDTO>> getAllOrders() {
    List<OrderDTO> allOrders = orderService.getAllOrders();
    return new ResponseEntity<>(allOrders, HttpStatus.OK);
  }

  @GetMapping("/getAllMyActiveOrders")
  public ResponseEntity<List<OrderDTO>> getAllMyActiveOrders(Authentication auth) {
    List<OrderDTO> allActiveOrders= orderService.getAllActiveOrders(auth.getName());
    return new ResponseEntity<>(allActiveOrders, HttpStatus.OK);
  }

  @GetMapping("/getOrderDetails/{id}")
  public ResponseEntity<OrderDTO> getOrderDetails(@PathVariable Long id) {
    OrderDTO details = orderService.getOrderDetails(id);
    return ResponseEntity.ok(details);
  }

  @GetMapping("/getMyOrdersHistory")
  public ResponseEntity<List<OrderDTO>> getMyOrdersHistory(Authentication auth) {
    List<OrderDTO> allHistoryOrders = orderService.getMyHistory(auth.getName());
    return new ResponseEntity<>(allHistoryOrders, HttpStatus.OK);
  }

  @PostMapping("/newOrder")
  public ResponseEntity<OrderDTO> newOrder(Authentication authentication, @RequestBody OrderCreateDTO orderCreateDTO) {
    OrderDTO dto = orderService.createOrder(authentication.getName(), orderCreateDTO);
    return new ResponseEntity<>(dto, HttpStatus.CREATED);
  }

  @DeleteMapping("/deleteOrder/{id}")
  @Transactional
  public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
    orderService.deleteOrder(id);
    return new ResponseEntity<>(HttpStatus.NO_CONTENT);
  }

  @PutMapping("/updateOrderStatus/{id}")
  public ResponseEntity<OrderDTO> updateOrderStatus(@PathVariable Long id) {
    OrderDTO dto = orderService.updateOrderStatus(id);
    return new ResponseEntity<>(dto, HttpStatus.OK);
  }

}
