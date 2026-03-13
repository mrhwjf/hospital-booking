<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Mail;
use App\Mail\sendingMails;

class MailController extends Controller
{
    public function sendMail()
    {
        Mail::to("b3taus3r001@gmail.com")->send(new sendingMails());

        return "Mail sent";
    }
}
