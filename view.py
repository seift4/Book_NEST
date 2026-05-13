from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
import json

def login_api(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        user = authenticate(username=data['username'], password=data['password'])
        if user is not None:
            login(request, user)
        
            url = '/admin/home/' if user.is_staff else '/user/home/'
            return JsonResponse({'success': True, 'redirect_url': url})
        return JsonResponse({'success': False, 'message': 'Invalid credentials'})
    return render(request, 'login.html')

def user_logout(request):
    logout(request)
    return redirect('/login/')