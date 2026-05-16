from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import login, logout
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.http import JsonResponse
from .models import User, Book, BorrowRecord
from .forms import SignUpForm, LoginForm, BookForm, EditBookForm
from django.utils import timezone
from django.views.decorators.http import require_POST


def index(request):
    return render(request, 'index.html')


def signup(request):
    if request.method == 'POST':
        form = SignUpForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
           
            if user.role == 'Admin':
                return redirect('admin_home')
            return redirect('user_home')
        else:
            print(form.errors)
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
    book = get_object_or_404(Book, id=book_id)
    return render(request, 'book_details.html', {'book': book})


@login_required
def borrowed_books(request):
    records = BorrowRecord.objects.filter(user=request.user, returned=False).select_related('book')
    return render(request, 'borrowed_books.html', {'records': records})


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

@login_required
@require_POST
def api_borrow_book(request, book_id):
    book = get_object_or_404(Book, id=book_id)
    
    if not book.is_available: return JsonResponse({'success': False, 'error': 'Book unavailable'})
    
    if BorrowRecord.objects.filter(user=request.user, book=book, returned=False).exists():
        return JsonResponse({'success': False, 'error': 'Already borrowed'})
    
    due_date = timezone.now() + timezone.timedelta(days=30)
    record = BorrowRecord.objects.create(
        user=request.user,
        book=book,
        due_date=due_date
    )
    
    book.is_available = False
    book.save()
    
    return JsonResponse({
        'success': True,
        'due_date': due_date.strftime('%B %d, %Y')
    })


@login_required
@require_POST
def api_return_book(request, record_id):
    record = get_object_or_404(BorrowRecord, id=record_id, user=request.user)
    
    if record.returned: return JsonResponse({'success': False, 'error': 'Already returned'})
    
    record.returned = True
    record.date_returned = timezone.now()
    record.save()
    
    record.book.is_available = True
    record.book.save()
    
    return JsonResponse({'success': True})

@login_required
def api_my_borrowed_books(request):
    records = BorrowRecord.objects.filter(user=request.user, returned=False).select_related('book')
    
    data = {
        'records': [
            {
                'id': r.id,
                'book_title': r.book.title,
                'book_author': r.book.author,
                'book_category': r.book.category,
                'date_borrowed': r.date_borrowed.strftime('%b %d, %Y'),
                'due_date': r.due_date.strftime('%b %d, %Y'),
            }
            for r in records
        ]
    }
    return JsonResponse(data)