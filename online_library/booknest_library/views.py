from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import login, logout
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.http import JsonResponse
from .models import User, Book, BorrowRecord
from .forms import SignUpForm, LoginForm, BookForm, EditBookForm


def index(request):
    return render(request, 'index.html')


def signup(request):
    if request.method == 'POST':
        form = SignUpForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect('user_home')
    else:
        form = SignUpForm()
    return render(request, 'signup.html', {'form': form})


def login_view(request):
    if request.method == 'POST':
        form = LoginForm(request, data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            
            next_url = request.POST.get('next') or request.GET.get('next')
            if next_url:
                return redirect(next_url)
            
            if user.role == 'Admin':
                return redirect('admin_home')
            return redirect('user_home')
    else:
        form = LoginForm()
    return render(request, 'login.html', {'form': form})


def logout_view(request):
    logout(request)
    return redirect('index')


@login_required
def user_home(request):
    return render(request, 'user_home.html')


@login_required
def search_books(request):
    return render(request, 'search.html')


@login_required
def book_details(request, book_id):
    return render(request, 'book_details.html')


@login_required
def borrowed_books(request):
    return render(request, 'borrowed_books.html')


@login_required
def admin_home(request):
    return render(request, 'admin_home.html')


@login_required
def admin_add_book(request):
    if request.method == 'POST':
        form = BookForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            messages.success(request, 'Book added successfully!')
            return redirect('view_books_admin')
    else:
        form = BookForm()
    return render(request, 'admin_add_book.html', {'form': form})


@login_required
def view_books_admin(request):
    books = Book.objects.all()
    return render(request, 'view_book_admin.html', {'books': books})


@login_required
def edit_book(request, book_id):
    book = get_object_or_404(Book, id=book_id)
    if request.method == 'POST':
        form = EditBookForm(request.POST, request.FILES, instance=book)
        if form.is_valid():
            form.save()
            messages.success(request, 'Book updated successfully!')
            return redirect('view_books_admin')
    else:
        form = EditBookForm(instance=book)
    return render(request, 'edit_book.html', {'form': form, 'book': book})


@login_required
def delete_book(request, book_id):
    book = get_object_or_404(Book, id=book_id)
    book.delete()
    messages.success(request, 'Book deleted successfully!')
    return redirect('view_books_admin')


def api_books_list(request):
    books = Book.objects.all().values('id', 'title', 'author', 'category', 'is_available', 'image')
    return JsonResponse(list(books), safe=False)


def api_book_detail(request, book_id):
    book = get_object_or_404(Book, id=book_id)
    data = {
        'id': book.id,
        'book_id': book.book_id,
        'title': book.title,
        'author': book.author,
        'category': book.category,
        'description': book.description,
        'image': book.image.url if book.image else None,
        'is_available': book.is_available,
    }
    return JsonResponse(data)