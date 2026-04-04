<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Mail;
use App\Mail\WelcomeMail;

class MailController extends Controller
{
    public function sendMail()
    {
        Mail::to("b3taus3r001@gmail.com")->send(new WelcomeMail("Nguyen Van A"));

        return "Mail sent";
    }
}
