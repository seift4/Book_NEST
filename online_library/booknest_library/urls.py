from django.urls import path
from . import views

urlpatterns = [
    # Auth routes
    path('', views.index, name='index'),
    path('signup/', views.signup, name='signup'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),

    # User routes
    path('user/home/', views.user_home, name='user_home'),
    path('user/search/', views.search_books, name='search'),
    path('user/book/<int:book_id>/', views.book_details, name='book_details'),
    path('user/borrowed/', views.borrowed_books, name='borrowed_books'),

    # Admin routes
     path('dashboard/home/', views.admin_home, name='admin_home'),
    path('dashboard/add-book/', views.admin_add_book, name='admin_add_book'),
    path('dashboard/view-books/', views.view_books_admin, name='view_books_admin'),

    path('dashboard/edit-book/<int:book_id>/', views.edit_book, name='edit_book'),
    path('dashboard/delete-book/<int:book_id>/', views.delete_book, name='delete_book'),

    # API routes
    path('api/books/', views.api_books_list, name='api_books_list'),
    path('api/book/<int:book_id>/', views.api_book_detail, name='api_book_detail'),
    path('api/borrow-book/<int:book_id>/', views.api_borrow_book, name='api_borrow_book'),  # ADD THIS
    path('api/return-book/<int:record_id>/', views.api_return_book, name='api_return_book'),  # ADD THIS
    path('api/my-borrowed-books/', views.api_my_borrowed_books, name='api_my_borrowed_books'),
]