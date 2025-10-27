package com.bookland.BookLand.Service.impl;

import com.bookland.BookLand.DTO.CartDTOs.AddToCartDTO;
import com.bookland.BookLand.DTO.CartDTOs.CartDTO;
import com.bookland.BookLand.DTO.CartDTOs.DeleteFromCartDTO;
import com.bookland.BookLand.Mapper.CartMapper;
import com.bookland.BookLand.Model.Book;
import com.bookland.BookLand.Model.Cart;
import com.bookland.BookLand.Model.CartItem;
import com.bookland.BookLand.Model.User;
import com.bookland.BookLand.Repository.BookRepository;
import com.bookland.BookLand.Repository.CartItemRepository;
import com.bookland.BookLand.Repository.CartRepository;
import com.bookland.BookLand.Repository.UserRepository;
import com.bookland.BookLand.Service.CartService;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

  private final CartRepository cartRepository;
  private final CartMapper cartMapper;
  private final CartItemRepository cartItemRepository;
  private final BookRepository bookRepository;
  private final UserRepository userRepository;

  @Override
  public CartDTO getUserCart(String name) {
    Long id = userRepository.findUserByLogin(name).getId();
    Optional<Cart> cartOptional = cartRepository.findByUserId(id);

    return cartOptional.map(cartMapper::toDto)
        .orElseGet(() -> {
          CartDTO emptyCart = new CartDTO();
          emptyCart.setCartItems(new ArrayList<>());
          emptyCart.setTotalPrice(0.0);
          return emptyCart;
        });
  }

  @Override
  @Transactional
  public CartDTO addItemToCart(String username, AddToCartDTO addDTO) {
    User user = userRepository.findByLogin(username)
        .orElseThrow(() -> new RuntimeException("Пользователь не найден: " + username));

    Cart cart = cartRepository.findByUserId(user.getId())
        .orElseGet(() -> createCartForUser(user));

    Book book = bookRepository.findById(addDTO.getBookId())
        .orElseThrow(() -> new RuntimeException("Книга не найдена с ID: " + addDTO.getBookId()));

    Optional<CartItem> existingItem = cart.getCartItems().stream()
        .filter(item -> item.getBook().getId().equals(addDTO.getBookId()))
        .findFirst();

    CartItem cartItem;
    if (existingItem.isPresent()) {
      cartItem = existingItem.get();
      cartItem.setQuantity(cartItem.getQuantity() + addDTO.getQuantity());
    } else {
      cartItem = CartItem.builder()
          .cart(cart)
          .book(book)
          .quantity(addDTO.getQuantity())
          .build();
      cart.getCartItems().add(cartItem);
    }

    cartItemRepository.save(cartItem);
    cart.setUpdatedAt(LocalDateTime.now());
    cartRepository.save(cart);

    return cartMapper.toDto(cart);
  }

  @Override
  @Transactional
  public CartDTO removeItemFromCart(String username, DeleteFromCartDTO deleteDTO) {
    User user = userRepository.findByLogin(username)
        .orElseThrow(() -> new RuntimeException("Пользователь не найден: " + username));

    Cart cart = cartRepository.findByUserId(user.getId())
        .orElseThrow(() -> new RuntimeException("Корзина не найдена для пользователя: " + username));

    CartItem cartItem = cart.getCartItems().stream()
        .filter(item -> item.getBook().getId().equals(deleteDTO.getBookId()))
        .findFirst()
        .orElseThrow(() -> new RuntimeException("Книга не найдена в корзине: " + deleteDTO.getBookId()));

    if (cartItem.getQuantity() > 1) {
      cartItem.setQuantity(cartItem.getQuantity() - 1);
      cartItemRepository.save(cartItem);
    } else {
      cart.getCartItems().remove(cartItem);
      cartItemRepository.delete(cartItem);
    }
    cart.setUpdatedAt(LocalDateTime.now());
    cartRepository.save(cart);

    return cartMapper.toDto(cart);
  }

  @Override
  @Transactional
  public void deleteItemFromCart(String username, DeleteFromCartDTO deleteDTO) {
    User user = userRepository.findByLogin(username)
        .orElseThrow(() -> new RuntimeException("Пользователь не найден: " + username));

    Cart cart = cartRepository.findByUserId(user.getId())
        .orElseThrow(() -> new RuntimeException("Корзина не найдена для пользователя: " + username));

    CartItem cartItem = cart.getCartItems().stream()
        .filter(item -> item.getBook().getId().equals(deleteDTO.getBookId()))
        .findFirst()
        .orElseThrow(() -> new RuntimeException("Книга не найдена в корзине: " + deleteDTO.getBookId()));

    cart.getCartItems().remove(cartItem);
    cartItemRepository.delete(cartItem);
    cart.setUpdatedAt(LocalDateTime.now());
    cartRepository.save(cart);
  }

  @Override
  @Transactional
  public void deleteCart(Long id) {
    cartRepository.deleteById(id);
  }

  private Cart createCartForUser(User user) {
    Cart cart = Cart.builder()
        .user(user)
        .createdAt(LocalDateTime.now())
        .updatedAt(LocalDateTime.now())
        .cartItems(new ArrayList<>())
        .build();
    return cartRepository.save(cart);
  }
}
