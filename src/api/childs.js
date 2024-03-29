import Cookies from "js-cookie";


const token = Cookies.get('token')
const headers = {
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
    }
};


export const get_token = async (username, password) => {
    const settings = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(
        {
            username, 
            password
        })
    };
    try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/login`, settings)
        if (response.status === 201) {
            const { access_token } = await response.json();
            Cookies.set('token', access_token, { expires: 7, secure: true });
            return access_token;
        }
    } catch (e) {
        console.error('Error posting data:', e);
        alert('An error occurred while sending data.');
    }
}

export const get_childs = async (userId) => {
    const settings = {
        method: 'GET',
        ...headers,
        };
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/parents/${userId}/childs`, settings)
            if (response.status === 200) {
              const body = await response.json();
                return body;
            }
        } catch (e) {
           console.error('Error fetching data:', e);
            alert('An error occurred while fetching data.');
        }
}

export const post_meal = async (childId, type, date) => {
   const body = { type: type };
    if (date !== null) {
        body.date = date;
    }

    const settings = {
      method: 'POST',
      ...headers,
      body: JSON.stringify(body)
    };
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/childs/${childId}/meals`, settings)
      if (response.status === 201) {
        return response
      }
    } catch (e) {
        console.error('Error posting data:', e);
        alert('An error occurred while sending data.');
    }
}


export const edit_meal = async (childId, type, mealId, date) => {
    const settings = {
      method: 'PATCH',
      ...headers,
      body: JSON.stringify({
          type: type,
          date: date
      })
    };
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/childs/${childId}/meals/${mealId}`, settings)
      if (response.status === 201) {
        return
      }
    } catch (e) {
        console.error('Error editing data:', e);
        alert('An error occurred while sending data.');
    }
}

export const delete_meal = async (childId, mealId) => {
    const settings = {
      method: 'DELETE',
      ...headers
    };
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/childs/${childId}/meals/${mealId}`, settings)
      if (response.status === 200) {
        return response
      }
    } catch (e) {
        console.error('Error deleting data:', e);
        alert('An error occurred while deleting.');
    }
}

export const get_meals = async (childId) => {
    const settings = {
      method: 'GET',
      ...headers
    };
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/childs/${childId}/meals`, settings)
      if (response.status === 200) {
        const body = await response.json();
        return body;
      }
    } catch (e) {
        console.error('Error fetching data:', e);
        alert('An error occurred while fetching data.');
    }
}