from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Book, BorrowRecord


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ['username', 'email', 'role', 'is_staff', 'is_active']
    list_filter = ['role', 'is_staff', 'is_active']
    fieldsets = UserAdmin.fieldsets + (
        ('Additional Info', {'fields': ('role',)}),
    )


@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ['book_id', 'title', 'author', 'category', 'is_available']
    list_filter = ['category', 'is_available']
    search_fields = ['title', 'author', 'book_id']


@admin.register(BorrowRecord)
class BorrowRecordAdmin(admin.ModelAdmin):
    list_display = ['user', 'book', 'date_borrowed', 'due_date', 'returned']
    list_filter = ['returned', 'date_borrowed']
    search_fields = ['user__username', 'book__title']