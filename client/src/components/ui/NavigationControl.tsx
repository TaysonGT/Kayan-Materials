import { MdKeyboardArrowLeft, MdKeyboardArrowRight, MdKeyboardDoubleArrowLeft, MdKeyboardDoubleArrowRight } from "react-icons/md"

interface Props {
    pageCount: number
    modifyPagination: (newPagination: Partial<{page: number, limit: number}>) => void
    maxPages: number
}

const NavigationControl:React.FC<Props> = ({pageCount, maxPages, modifyPagination})=>{
    
    const changePage = (action: 'start' | 'previous' | 'next' | 'end') => {
        if(action === 'start' && pageCount > 1){
            modifyPagination({page: 1})
        } else if(action === 'previous' && pageCount > 1){
            modifyPagination({page: pageCount - 1})
        } else if(action === 'next' && pageCount < maxPages){
            modifyPagination({page: pageCount + 1})
        } else if(action === 'end' && pageCount < maxPages){
            modifyPagination({page: maxPages})
        }
    }

    return (
        <div dir="ltr" className='flex gap-1 text-xl justify-center mt-4'>
            <div onClick={()=>changePage('start')} className={`w-8 flex justify-center items-center border border-${pageCount>1? 'black cursor-pointer': 'gray-500 text-gray-500 cursor-not-allowed'}`}><MdKeyboardDoubleArrowLeft/></div>
            <div onClick={()=>changePage('previous')} className={`w-8 flex justify-center items-center border border-${pageCount>1? 'black cursor-pointer': 'gray-500 text-gray-500 cursor-not-allowed'}`}><MdKeyboardArrowLeft/></div>
            <div className='w-8 flex justify-center items-center border-b-2 border-black text-sm py-1'>{pageCount}</div>
            <div onClick={()=>changePage('next')} className={`w-8 flex justify-center items-center border border-${pageCount<maxPages? 'black cursor-pointer': 'gray-500 text-gray-500 cursor-not-allowed'}`}><MdKeyboardArrowRight/></div>
            <div onClick={()=>changePage('end')} className={`w-8 flex justify-center items-center border border-${pageCount<maxPages? 'black  cursor-pointer': 'gray-500 text-gray-500 cursor-not-allowed'}`}><MdKeyboardDoubleArrowRight/></div>
        </div> 
    )
}

export default NavigationControl