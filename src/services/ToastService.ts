import { toast } from 'react-toastify'

export class ToastService {
    // Wrapping this in a service so it can be injected and the depedency can live here.
    // Mmmmm toast injection
    displayError = (message: string) => {
        toast.error(message, {hideProgressBar: true, closeOnClick: true})
    }
}
