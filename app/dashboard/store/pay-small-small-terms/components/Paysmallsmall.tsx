'use client'

import { useState, useRef, useEffect } from 'react'
import svgPaths from "../imports/svg-htimv6y8us"
import svgPathsMobile from "../imports/svg-xie0mhws6u"
import imgImage from "../../../../../app/public/images/new/images/logo.png"
import imgSubtract from "../../../../../app/public/images/new/images/logo.png"
import imgSureimportsReverse from "../../favicon.ico"
import { imgImage1 } from "../imports/svg-znnzx"
import { imgImage1 as imgImage1Mobile } from "../imports/svg-a31k4"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Card, CardContent } from "./ui/card"
import { Badge } from "./ui/badge"
import { toast } from "sonner"
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/context/AuthContext'
import { useNavigationWithAlert } from '@/hooks/useNavigationWithAlert';
import Loader from '@/components/uix/Loader'

// Desktop Components
interface ProductImageProps {
  product: any
}

interface userData {
  address: unknown;
  id: number;
  pidUser: string;
  userEmail: string;
  userFirstname: string;
  gender: string;
  dob: Date | undefined;
  phone: string;
  country: string;
  userImage: string;
  // bank_name: string;
  // bank_account_number: string;
  // bank_account_name: string;
}



function ProductImage({product}: ProductImageProps) {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
      
      <img
              src={
                (process.env.NEXT_PUBLIC_R2_PUBLIC_URL +
                  '/' +
                  `${product.productImage}`) as string
              }
              alt="Product Image"
              className="p-7 rounded-lg h-96 h-fullx w-fullx object-coverx"
            />

      {/* <div className="[grid-area:1_/_1] bg-neutral-50 h-[300px] md:h-[456px] ml-0 mt-0 relative rounded-[20px] w-full max-w-[560px]">
        <div
          aria-hidden="true"
          className="absolute border border-[rgba(0,0,0,0.05)] border-solid inset-0 pointer-events-none rounded-[20px]"
        />
      </div> */}

      {/* <div
        className="[grid-area:1_/_1] bg-[100%_49.4%] bg-no-repeat bg-size-[101.62%_159.91%] h-[270px] md:h-[425px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-20px_-10px] md:mask-position-[-36px_-15px] mask-size-[300px_300px] md:mask-size-[560px_456px] ml-4 md:ml-9 mt-[10px] md:mt-[15px] w-[280px] md:w-[489px]"
        style={{
          backgroundImage: `url('${imgImage}')`,
          maskImage: `url('${imgImage1}')`,
        }}
      /> */}
    </div>
  )
}

function ProductCard({product}: any) {
  return (
    <Card className="w-full max-w-[560px] p-0 border-none shadow-none">
      <ProductImage product={product} />
    </Card>
  )
}

function ProductInfo({product, amount}:any) {
  return (
    <div className="absolute bottom-0 left-0 right-0 p-4 md:p-[30px] bg-white/80 backdrop-blur-sm rounded-b-[20px] dark:bg-black border-slate-600">
      <div className="space-y-2.5">
        <Badge className="bg-indigo-800 text-white px-5 py-1.5 rounded-[30px] text-sm">
        {product.productBrand}
        </Badge>
        <div className="space-y-1">
          <h2 className="text-xl md:text-[28px] font-semibold text-slate-800 leading-tight dark:text-white">
          {product.productName}
          </h2>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
            <span className="text-lg md:text-[20px] font-semibold text-indigo-800">
              ₦
              {
                parseFloat(amount)
                  .toFixed(2)
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',') as string
              }
            </span>
            <span className="text-sm md:text-base text-slate-800 dark:text-white">
              Inclusive of 5% PSS Fee
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

interface StepCardProps {
  number: string
  children: React.ReactNode
}

function StepCard({ number, children }: StepCardProps) {
  return (
    <Card className="relative h-full min-h-[200px] md:min-h-[264px] p-4 md:p-6">
      <Badge className="absolute top-4 left-4 bg-indigo-800 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold p-0">
        {number}
      </Badge>
      <div className="mt-8 text-xs md:text-sm text-slate-800 leading-relaxed dark:text-white">
        {children}
      </div>
    </Card>
  )
}

function HowItWorks({}: {}) {
  const steps = [
    {
      number: "01",
      content: "When you click the button below, a virtual payment account will be created for you. You can pay into this account at your own pace, as long as full payment is completed within 6 months."
    },
    {
      number: "02",
      content: "All payments made through this plan attract a 5% additional fee. This helps us manage exchange rate fluctuations in Nigeria and charges from our payment processor."
    },
    {
      number: "03",
      content: "Your product will only be shipped after full payment has been received."
    },
    {
      number: "04",
      content: "To activate your pay small smalls account, you'll be required to make a deposit of ₦5,000 to the dedicated virtual account created for you."
    },
    {
      number: "05",
      content: "You can choose to cancel at any time. In such cases, we will process a refund of the total amount paid, less 2.5% to cover administrative costs."
    }
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
      {steps.map((step) => (
        <StepCard key={step.number} number={step.number}>
          {step.content}
        </StepCard>
      ))}
    </div>
  )
}

interface PaymentFormProps {
  phoneNumber: string
  onPhoneNumberChange: (value: string) => void
  onSubmit: () => void
  isLoading: boolean
}

function PaymentForm({ phoneNumber, onPhoneNumberChange, onSubmit, isLoading }: PaymentFormProps) {
  const isValidPhone = phoneNumber.length >= 10 && /^\+?[0-9\s-()]+$/.test(phoneNumber)

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="phone" className="text-sm text-slate-800 dark:text-white">
          Phone Number
        </Label>
        <Input
          id="phone"
          type="tel"
          placeholder="Enter a Valid Phone Number"
          value={phoneNumber}
          onChange={(e) => onPhoneNumberChange(e.target.value)}
          className="w-full h-12 px-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-800 focus:border-transparent"
        />
      </div>
      <p className="text-sm text-slate-800 dark:text-white">
        Once ready, click the button below to begin.
      </p>
      <Button
        onClick={onSubmit}
        disabled={!isValidPhone || isLoading}
        className="w-full h-12 bg-indigo-800 hover:bg-indigo-700 text-white rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <div className="w-6 h-6 flex items-center justify-center">
          <svg
            className="w-4 h-4"
            fill="none"
            preserveAspectRatio="none"
            viewBox="0 0 24 24"
          >
            <path
              d={svgPaths.p3d9bb080}
              fill="currentColor"
            />
            <path
              d={svgPaths.p4cbce00}
              fill="currentColor"
            />
          </svg>
        </div>
        {isLoading ? "Processing..." : "Add Product to Pay Small Small"}
      </Button>
    </div>
  )
}

// Mobile Components
function MobileProductImage({product}:any) {
  return (
    <div className="relative w-full max-w-[350px] aspect-square">
      {/* <div className="absolute inset-0 bg-neutral-50 rounded-[15px] border border-[rgba(0,0,0,0.05)]">
      </div> */}

      <img
              src={
                (process.env.NEXT_PUBLIC_R2_PUBLIC_URL +
                  '/' +
                  `${product.productImage}`) as string
              }
              alt="Product Image"
              className="p-7 h-full w-full object-cover"
            />
      <div
        className="absolute inset-[15%] bg-[100%_49.4%] bg-no-repeat bg-size-[101.62%_159.91%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-center mask-size-contain"
        style={{
          backgroundImage: `url('${imgImage}')`,
          maskImage: `url('${imgImage1Mobile}')`,
        }}
      />
    </div>
  )
}

function MobileProductInfo(product:any) {
  return (
    <div className="bg-neutral-50 border border-[rgba(0,0,0,0.05)] rounded-[15px] p-5 w-full dark:bg-black">
      <div className="flex flex-col gap-2.5">
        <Badge className="bg-indigo-800 text-white px-5 py-1.5 rounded-[30px] text-sm w-fit">
          {product.productBrand}
        </Badge>
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold text-slate-800 leading-tight dark:text-white">
            {product.productName}
          </h2>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
            <span className="text-base font-semibold text-indigo-800">

                {
                  ('₦' +
                    (product.amount as number/1)
                      .toFixed(2)
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                  ) as string
                }

            </span>
            <span className="text-sm text-slate-800 dark:text-white">
              Inclusive of 5% PSS Fee
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

interface MobileHowItWorksProps {
  currentStep: number
  onStepChange: (step: number) => void
}

function MobileHowItWorks({ currentStep, onStepChange }: MobileHowItWorksProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  
  const steps = [
    {
      number: "01",
      content: "When you click the button below, a virtual payment account will be created for you. You can pay into this account at your own pace, as long as full payment is completed within 6 months."
    },
    {
      number: "02",
      content: "All payments made through this plan attract a 5% additional fee. This helps us manage exchange rate fluctuations in Nigeria and charges from our payment processor."
    },
    {
      number: "03",
      content: "Your product will only be shipped after full payment has been received."
    },
    {
      number: "04",
      content: "To activate your pay small smalls account, you'll be required to make a deposit of ₦5,000 to the dedicated virtual account created for you."
    },
    {
      number: "05",
      content: "You can choose to cancel at any time. In such cases, we will process a refund of the total amount paid, less 2.5% to cover administrative costs."
    }
  ]

  const scrollToStep = (stepIndex: number) => {
    const container = scrollContainerRef.current
    const card = cardRefs.current[stepIndex]
    
    if (container && card) {
      const cardLeft = card.offsetLeft
      const containerWidth = container.clientWidth
      const cardWidth = card.clientWidth
      
      // Center the card in the container
      const scrollPosition = cardLeft - (containerWidth - cardWidth) / 2
      
      container.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      })
    }
  }

  // Scroll to step when currentStep changes from outside
  useEffect(() => {
    scrollToStep(currentStep)
  }, [currentStep])

  const handleScroll = () => {
    const container = scrollContainerRef.current
    if (!container) return

    const containerWidth = container.clientWidth
    const scrollLeft = container.scrollLeft
    
    // Calculate which card is most visible
    let activeIndex = 0
    let maxVisibility = 0
    
    cardRefs.current.forEach((card, index) => {
      if (!card) return
      
      const cardLeft = card.offsetLeft
      const cardRight = cardLeft + card.clientWidth
      const visibleLeft = Math.max(cardLeft, scrollLeft)
      const visibleRight = Math.min(cardRight, scrollLeft + containerWidth)
      const visibility = Math.max(0, visibleRight - visibleLeft) / card.clientWidth
      
      if (visibility > maxVisibility) {
        maxVisibility = visibility
        activeIndex = index
      }
    })
    
    if (activeIndex !== currentStep) {
      onStepChange(activeIndex)
    }
  }

  useEffect(() => {
    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener('scroll', handleScroll)
      return () => container.removeEventListener('scroll', handleScroll)
    }
  }, [currentStep])

  return (
    <div className="w-full overflow-x-auto" ref={scrollContainerRef}>
      <div className="flex gap-3 pb-4" style={{ width: `${steps.length * 192}px` }}>
        {steps.map((step, index) => (
          <div 
            key={step.number} 
            className="flex-shrink-0 w-[189px]"
            ref={(el:any) => cardRefs.current[index] = el}
          >
            <Card className="h-[264px] p-4">
              <Badge className="bg-indigo-800 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold p-0 mb-4">
                {step.number}
              </Badge>
              <p className="text-sm text-slate-800 leading-relaxed dark:text-white">
                {step.content}
              </p>
            </Card>
          </div>
        ))}
      </div>
    </div>
  )
}

interface MobilePaginationProps {
  totalSteps: number
  currentStep: number
  onStepClick: (step: number) => void
}

function MobilePagination({ totalSteps, currentStep, onStepClick }: MobilePaginationProps) {
  const dots = Array.from({ length: Math.min(totalSteps, 3) }, (_, index) => {
    let dotIndex = index
    
    // If we have more than 3 steps, calculate which dots to show
    if (totalSteps > 3) {
      if (currentStep <= 1) {
        // Show first 3 dots
        dotIndex = index
      } else if (currentStep >= totalSteps - 2) {
        // Show last 3 dots
        dotIndex = totalSteps - 3 + index
      } else {
        // Show current step in the middle
        dotIndex = currentStep - 1 + index
      }
    }
    
    const isActive = dotIndex === currentStep
    
    return (
      <button
        key={dotIndex}
        onClick={() => onStepClick(dotIndex)}
        className="w-[9px] h-[9px] rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-800 focus:ring-opacity-50"
        style={{
          backgroundColor: isActive ? '#3730A3' : '#8A85DD'
        }}
        aria-label={`Go to step ${dotIndex + 1}`}
      />
    )
  })

  return (
    <div className="flex items-center gap-2 h-[9px]">
      {dots}
    </div>
  )
}

function MobilePaymentForm({ phoneNumber, onPhoneNumberChange, onSubmit, isLoading }: PaymentFormProps) {
  const isValidPhone = phoneNumber.length >= 10 && /^\+?[0-9\s-()]+$/.test(phoneNumber)

  return (
    <div className="flex flex-col gap-2.5 w-full">
      <Label htmlFor="phone-mobile" className="text-sm text-slate-800 dark:text-white">
        Phone Number
      </Label>
      <Input
        id="phone-mobile"
        type="tel"
        placeholder="Enter a Valid Phone Number"
        value={phoneNumber}
        onChange={(e) => onPhoneNumberChange(e.target.value)}
        className="w-full h-12 px-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-800 focus:border-transparent"
      />
      <p className="text-sm text-slate-800 dark:text-white">
        Once ready, click the button below to begin.
      </p>
      <Button
        onClick={onSubmit}
        disabled={!isValidPhone || isLoading}
        className="w-full h-12 bg-indigo-800 hover:bg-indigo-700 text-white rounded-lg relative flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <div className="absolute left-4 w-6 h-6 flex items-center justify-center">
          <svg
            className="w-4 h-4"
            fill="none"
            preserveAspectRatio="none"
            viewBox="0 0 24 24"
          >
            <path
              d={svgPathsMobile.p3d9bb080}
              fill="currentColor"
            />
            <path
              d={svgPathsMobile.p4cbce00}
              fill="currentColor"
            />
          </svg>
        </div>
        <span className="text-center">
          {isLoading ? "Processing..." : "Add Product to Pay Small Small"}
        </span>
      </Button>
    </div>
  )
}


export default function App({ product }: any) {

    const router = useRouter();
  
    const { user } = useAuth();
   // const [userData, setUserData] = useState<userData>(); //DATA FROM API CALL

  
    //calculate 5% of product price
    let price = product.productPrice + product.productPrice * 0.05;
  
    const [pidUser, setPidUser] = useState(user?.pidUser);
    const [email, setEmail] = useState(user?.userEmail);
    const [pidProduct, setPidProduct] = useState(product.pidProduct);
    //const [phone, setPhoneNumber] = useState<number>(0);
    const [phone, setPhoneNumber] = useState(0);
    const [amount, setAmount] = useState(price);
    const [quantity, setQuantity] = useState(1);
    
  //const [phoneNumber, setPhoneNumber] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

    const navigateWithAlert = useNavigationWithAlert();


    //FORM DATA SUBMISSION
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      //console.log(file);
      //setLoading(true);
  
      //await new Promise((resolve) => setTimeout(resolve, 3000));
  
      const formData = new FormData() as any;
  
      formData.append('pidUser', pidUser);
      formData.append('userEmail', email);
      formData.append('pidProduct', pidProduct);
      formData.append('phone', phone);
      formData.append('amount', amount);
      formData.append('quantity', quantity);
      //toast.info('XDATA: '+JSON.stringify(formData.pidUser)+formData['pidUser']);

  
      //MAKE REQUEST ATTEMPT
      try {
        toast.info('Processing . . .');
        //MAKE REQUEST
        const res = await fetch('/api/crud/pay-small-small/add-product', {
          method: 'POST',
          body: formData,
        });
  
        // GET & PROCESS RESPONSE FROM API
        const data: any = await res.json();
  
        if (data.statusx == 'SUCCESS') {
          navigateWithAlert(
            '/dashboard/pay-small-small?status=SAVED',
            'success',
            data.message,
          );
        }
        
  
        // if (data.responsex.status == 'SUCCESS') {
        //   openModal();
        //   toast.success(data.responsex.message);
        // }
        if (data.statusx == 'NO_PHONE_NUMBER') {
          toast.warning(data.message);
        }
        if (data.statusx == 'FAILED') {
          toast.error(data.message);
        }
      } catch (error: any) {
        console.log(error.message);
      } finally {
        //setLoading(false);
      }
    }


  // const handleSubmit = async () => {
  //   if (phoneNumber.length < 10) {
  //     toast.error("Please enter a valid phone number")
  //     return
  //   }

  //   setIsLoading(true)
    
  //   // Simulate API call
  //   try {
  //     await new Promise(resolve => setTimeout(resolve, 2000))
  //     toast.success("Successfully added to Pay Small Small! Check your email for virtual account details.")
  //     setPhoneNumber("")
  //   } catch (error) {
  //     toast.error("Something went wrong. Please try again.")
  //   } finally {
  //     setIsLoading(false)
  //   }
  // }

  const handleStepChange = (step: number) => {
    setCurrentStep(step)
  }

  const handleStepClick = (step: number) => {
    setCurrentStep(step)
  }





  //GET USER PROFILE RECORDS
  const fetchUser = async (pidUser: string) => {
    try {
      //request for users
      const res = await fetch(`/api/user/${pidUser}`);

      //check if request was successful
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to fetch user');
      }

      //fetch json records into userData
      const data: userData = await res.json();

      //update user records variables
      //setUserData(data);
      //setPidUser(data.pidUser);
      // setFullName(data.userFirstname);
      // setGender(data.gender);
      // setDOB(data.dob);
      setPhoneNumber(data.phone as any);
      // setCountry(data.country);
      // setAddress(data.address);
      // setImagex(data.userImage);
    } catch (err: any) {
      //setError(err.message || 'An error occurred');
    } finally {
      //setLoading(false);
    }
  };

  //run fetchUser function to get user records
  useEffect(() => {
    if (pidUser) {
      fetchUser(pidUser);
    }
  }, [pidUser]);

  //CHECK IF USER DATA HAS BEEN FULLY LOADED TO DOM
  //if (!userData) return <Loader />;





  return (
    <>
      {/* Mobile Layout */}
      <div className="sm:hidden bg-slate-50 w-full min-h-screen dark:bg-black">
        <div className="flex flex-col px-5 py-6 gap-6 w-full">
          {/* Page Title */}
          {/* <div className="w-full">
            <h1 className="text-lg font-semibold text-slate-800">
              Pay Small Small Terms
            </h1>
          </div> */}

          {/* Product Section */}
          <div className="flex flex-col gap-2.5 w-full max-w-[390px] mx-auto">
            <div className="w-full flex justify-center">
              <MobileProductImage product={product} />
            </div>
            <MobileProductInfo />
          </div>

          {/* Content Section */}
          <div className="bg-neutral-50 border border-[rgba(0,0,0,0.05)] rounded-[15px] p-5 w-full max-w-[390px] mx-auto dark:bg-black dark:text-white">
            <div className="flex flex-col gap-2.5 w-full">
              <h2 className="text-base font-semibold text-slate-800 dark:text-white">
                Pay Small Small Terms
              </h2>
              
              <div className="flex flex-col gap-1 text-sm text-slate-800 dark:text-white">
                <p>Thank you for choosing the "Pay Small Small" option on Sure Imports.</p>
                <p>
                  This flexible payment plan allows you to pay for your selected product
                  in convenient installments over a maximum period of 6 months. Once
                  your payment is complete, your item will be shipped from China to
                  Lagos, Nigeria.
                </p>
              </div>
              
              <h3 className="text-base font-semibold text-slate-800 mt-2 dark:text-white">
                Here's how it works:
              </h3>
              
              <div className="w-full">
                <MobileHowItWorks 
                  currentStep={currentStep}
                  onStepChange={handleStepChange}
                />
              </div>
              
              <div className="flex justify-center mt-2">
                <MobilePagination 
                  totalSteps={5}
                  currentStep={currentStep}
                  onStepClick={handleStepClick}
                />
              </div>
              
              <div className="flex flex-col gap-2.5 mt-4">
                <p className="text-sm text-slate-800 dark:text-white">
                  To proceed, please ensure your Sure Imports account profile includes your phone number. If it's missing, kindly enter it below.
                </p>
                <MobilePaymentForm
                  phoneNumber={phone as any}
                  onPhoneNumberChange={setPhoneNumber as any}
                  onSubmit={handleSubmit as any}
                  isLoading={isLoading}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden sm:block min-h-screen bg-slate-50 relative overflow-x-hidden dark:bg-black">
        {/* Content */}
        <div className="relative z-10x container mx-auto px-4 py-8 md:py-16 max-w-7xl">
          {/* Header */}
          {/* <div className="mb-8 md:mb-16">
            <h1 className="text-xl md:text-[22px] font-semibold text-slate-800">
              Pay Small Small Terms
            </h1>
          </div> */}

          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Product Section */}
            <div className="flex-shrink-0 w-full lg:w-auto flex justify-center lg:justify-start">
              <div className="relative">
                <ProductCard product={product} />
                <ProductInfo product={product} amount={amount} />
              </div>
            </div>

            {/* Information Section */}
            <div className="flex-1">
              <Card className="w-full bg-neutral-50 border border-[rgba(0,0,0,0.05)] dark:bg-black ">
                <CardContent className="p-4 md:p-8 space-y-6">
                  <div>
                    <h2 className="text-lg md:text-[18px] font-semibold text-slate-800 mb-4 dark:text-white">
                      Pay Small Small
                    </h2>
                    <div className="space-y-4 text-sm md:text-[14px] text-slate-800 dark:text-white">
                      <p>Thank you for choosing the "Pay Small Small" option on Sure Imports.</p>
                      <p>
                        This flexible payment plan allows you to pay for your selected product
                        in convenient installments over a maximum period of 6 months. Once
                        your payment is complete, your item will be shipped from China to
                        Lagos, Nigeria.
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base md:text-[16px] font-semibold text-slate-800 mb-4 dark:text-white">
                      Here's how it works:
                    </h3>
                    <HowItWorks />
                  </div>

                  <div>
                    <h3 className="text-base md:text-[16px] text-slate-800 mb-4 dark:text-white">
                      To proceed, please ensure your Sure Imports account profile includes your phone number. If it's missing, kindly enter it below.
                    </h3>
                    <PaymentForm
                      phoneNumber={phone as any}
                      onPhoneNumberChange={setPhoneNumber as any}
                      onSubmit={handleSubmit as any}
                      isLoading={isLoading}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

