'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
export default function SpecialSourcingCardPayment({ requestId, disabled }: { requestId: string; disabled?: boolean }) {
  const [busy,setBusy]=useState(false),[error,setError]=useState('');
  return <div><Button type="button" disabled={disabled||busy} onClick={async()=>{
    setBusy(true);setError('');
    try { const response=await fetch('/api/paypal/special-sourcing',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({requestId})});const data=await response.json();if(!response.ok)throw Error(data.message);window.location.assign(data.authorizationUrl); }
    catch(error){setError(error instanceof Error?error.message:'Checkout unavailable.');setBusy(false);}
  }}>{busy?'Opening checkout…':'Pay USD 20 by card or PayPal'}</Button>{error&&<p role="alert" className="mt-3 text-sm text-destructive">{error}</p>}</div>;
}
