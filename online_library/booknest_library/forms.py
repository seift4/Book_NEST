from django import forms
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from .models import User, Book


class SignUpForm(UserCreationForm):
    ROLE_CHOICES = [
        ('Admin', 'Admin'),
        ('User', 'User'),
    ]
    
    email = forms.EmailField(required=True)
    role = forms.ChoiceField(choices=ROLE_CHOICES, widget=forms.RadioSelect, initial='User')

    class Meta:
        model = User
        fields = ['username', 'email', 'role', 'password1', 'password2']


class LoginForm(AuthenticationForm):
    username = forms.CharField(max_length=10, widget=forms.TextInput(attrs={
        'placeholder': 'email/username',
        'maxlength': '10'
    }))
    password = forms.CharField(max_length=10, widget=forms.PasswordInput(attrs={
        'placeholder': 'password',
        'maxlength': '10'
    }))


class BookForm(forms.ModelForm):
    class Meta:
        model = Book
        fields = ['book_id', 'title', 'author', 'category','price', 'description', 'image']
        widgets = {
            'description': forms.Textarea(attrs={'rows': 5, 'cols': 35, 'placeholder': 'Write the book description here...'}),
        }


class EditBookForm(forms.ModelForm):
    class Meta:
        model = Book
        fields = ['title', 'author', 'category', 'description']
        widgets = {
            'description': forms.Textarea(attrs={'rows': 5, 'cols': 35}),
        }