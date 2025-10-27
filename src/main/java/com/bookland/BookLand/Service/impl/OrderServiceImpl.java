package com.bookland.BookLand.Service.impl;

import com.bookland.BookLand.DTO.OrderDTOs.OrderCreateDTO;
import com.bookland.BookLand.DTO.OrderDTOs.OrderDTO;
import com.bookland.BookLand.DTO.OrderDTOs.OrderItemDTO;
import com.bookland.BookLand.Exception.UserNotFoundException;
import com.bookland.BookLand.Mapper.OrderItemMapper;
import com.bookland.BookLand.Mapper.OrderMapper;
import com.bookland.BookLand.Model.Book;
import com.bookland.BookLand.Model.EnumClasses.OrderStatus;
import com.bookland.BookLand.Model.EnumClasses.PaymentMethod;
import com.bookland.BookLand.Model.Order;
import com.bookland.BookLand.Model.OrderItem;
import com.bookland.BookLand.Model.User;
import com.bookland.BookLand.Repository.BookRepository;
import com.bookland.BookLand.Repository.OrderRepository;
import com.bookland.BookLand.Repository.UserRepository;
import com.bookland.BookLand.Service.OrderService;
import jakarta.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

  private final OrderRepository orderRepository;
  private final OrderMapper orderMapper;
  private final UserRepository userRepository;
  private final BookRepository bookRepository;

  @Override
  @Transactional
  public OrderDTO createOrder(String name, OrderCreateDTO orderCreateDTO) {
    User user = userRepository.findByLogin(name)
        .orElseThrow(()->new UserNotFoundException(name));
    if(user.getWallet() < orderCreateDTO.getTotalAmount()){
      throw new RuntimeException("Недостаточно средств на балансе");
    }
    Order order = Order.builder()
        .user(user)
        .totalAmount(orderCreateDTO.getTotalAmount())
        .status(OrderStatus.PENDING)
        .shippingAddress(orderCreateDTO.getShippingAddress())
        .paymentMethod(PaymentMethod.PURSE)
        .trackingNumber(generateTruckingNumber())
        .orderItems(new ArrayList<>())
        .build();
    List<OrderItem> orderItems = new ArrayList<>();
    for (OrderItemDTO itemDTO : orderCreateDTO.getAllItems()) {
      Book book = bookRepository.findById(itemDTO.getBook().getId())
          .orElseThrow(() -> new RuntimeException("Книга не найдена: " + itemDTO.getBook().getId()));

      OrderItem orderItem = OrderItem.builder()
          .order(order)
          .book(book)
          .quantity(itemDTO.getQuantity())
          .unitPrice(itemDTO.getUnitPrice())
          .build();

      orderItems.add(orderItem);
    }

    order.setOrderItems(orderItems);
    user.setWallet(user.getWallet() - orderCreateDTO.getTotalAmount());
    userRepository.save(user);
    Order savedOrder = orderRepository.save(order);
    return orderMapper.toDTO(savedOrder);
  }

  private String generateTruckingNumber() {
    return "TRK" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
  }

  @Override
  @Transactional
  public void deleteOrder(Long id) {
    Order order = orderRepository.findById(id)
        .orElseThrow(()->new RuntimeException(""));
    User user = userRepository.findUserById(order.getUser().getId());
    user.setWallet(user.getWallet() + order.getTotalAmount());
    userRepository.save(user);
    orderRepository.deleteById(id);
  }

  @Override
  public List<OrderDTO> getAllActiveOrders(String name) {
    Long userId = userRepository.findUserByLogin(name).getId();
    List<Order> allUserOrders = orderRepository.getOrdersByUserId(userId);
    List<Order> activeOrders=allUserOrders.stream()
        .filter(order->order.getStatus() == OrderStatus.PENDING ||
            order.getStatus() == OrderStatus.PROCESSING ||
            order.getStatus() == OrderStatus.SHIPPED)
        .collect(Collectors.toList());
    return orderMapper.toDTO(activeOrders);
  }

  @Override
  public List<OrderDTO> getMyHistory(String name) {
    Long userId = userRepository.findUserByLogin(name).getId();
    List<Order> allUserOrders = orderRepository.getOrdersByUserId(userId);
    List<Order> historyOrders = allUserOrders.stream()
        .filter(order -> order.getStatus() == OrderStatus.CANCELLED ||
            order.getStatus() == OrderStatus.DELIVERED)
        .collect(Collectors.toList());
    return orderMapper.toDTO(historyOrders);
  }

  @Override
  public OrderDTO getOrderDetails(Long id) {
    Order order = orderRepository.findById(id)
        .orElseThrow(()->new RuntimeException("Error"));
    return orderMapper.toDTO(order);
  }

  @Override
  public List<OrderDTO> getAllOrders() {
    List<Order> allOrders = orderRepository.findAll();
    return orderMapper.toDTO(allOrders);
  }

  @Override
  public OrderDTO updateOrderStatus(Long id) {
    Order order = orderRepository.findById(id)
        .orElseThrow(()->new RuntimeException("Error"));
    order.setStatus(OrderStatus.DELIVERED);
    return orderMapper.toDTO(orderRepository.save(order));
  }

}
