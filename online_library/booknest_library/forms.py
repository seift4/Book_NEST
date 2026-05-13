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
    username = forms.CharField(widget=forms.TextInput(attrs={
        'placeholder': 'Username',
    }))
    password = forms.CharField(widget=forms.PasswordInput(attrs={
        'placeholder': 'Password',
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