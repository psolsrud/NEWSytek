from django import forms

from .models import *

class DataForm(forms.ModelForm):
    class Meta:
        model = DataModel
        fields = ('__all__')
        exclude = ('id', 'geom', )

class UserRegistrationForm(forms.ModelForm):
    password = forms.CharField(label='Password',
                                widget=forms.PasswordInput)
    password2 = forms.CharField(label='Repeat password',
                                widget=forms.PasswordInput)

    class Meta:
        model = CustomUser
        fields = ('username', )

    def clean_password2(self):
        cd = self.cleaned_data
        if cd['password'] != cd['password2']:
            raise forms.ValidationError('Password don\'t match.')
        return cd['password2']

    def __init__(self, *args, **kwargs):
        form = super(UserRegistrationForm, self).__init__(*args, **kwargs)
        for field_name, field in self.fields.items():
            field.widget.attrs['class'] = 'form-control'
            field.widget.attrs['placeholder'] = field.label

class UserEditForm(forms.ModelForm):
    class Meta:
        model = CustomUser
        fields = ('username', )

    def __init__(self, *args, **kwargs):
        form = super(UserEditForm, self).__init__(*args, **kwargs)
        for field_name, field in self.fields.items():
            field.widget.attrs['class'] = 'form-control'
            field.widget.attrs['placeholder'] = field.label