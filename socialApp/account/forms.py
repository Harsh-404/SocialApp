from django import forms

class register(forms.ModelForm):
    username = forms.CharField(max_length=255,)
    password = forms.CharField(max_length=10,)
    