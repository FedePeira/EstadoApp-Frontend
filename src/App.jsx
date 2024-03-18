import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getNotes, createNote, updateNote } from './requests'

const App = () => {
  const queryClient = useQueryClient()

  // Mutation -->
  const newNoteMutation = useMutation({ 
    mutationFn: createNote,
    onSuccess: (newNote) => {
      const notes = queryClient.getQueryData(['notes'])
      queryClient.setQueryData(['notes'], notes.concat(newNote))    }, 
  })

  const updateNoteMutation = useMutation({
    mutationFn: updateNote,
    onSuccess: () => {
      queryClient.invalidateQueries('notes')
    },
  })

  // AddNote with Mutation -->
  const addNote = async (event) => {
    event.preventDefault()
    const content = event.target.note.value
    event.target.note.value = ''
    newNoteMutation.mutate({ 
      content, 
      important: true 
    })
    console.log('Adding --> "', content, '"')
  }

  // Update with Mutation -->
  const toggleImportance = (note) => {
    updateNoteMutation.mutate({...note, important: !note.important })
    console.log('Toggle importance change --> "', note.content, '"')
  }

  // Get All ntoes using Query -->
  const result = useQuery({
    queryKey: ['notes'],
    queryFn: getNotes,
    // queryFn: () => axios.get('http://localhost:3001/notes').then(res => res.data)
    refetchOnWindowFocus: false
  })
  console.log('Notes -->')
  console.log(JSON.parse(JSON.stringify(result)))
  console.log('--------------------------')

  if ( result.isLoading ) {
    return <div>loading data...</div>
  }

  const notes = result.data

  return(
    <div>
      <h2>Notes app</h2>
      <form onSubmit={addNote}>
        <input name="note" />
        <button type="submit">add</button>
      </form>
      {notes.map(note =>
        <li key={note.id} onClick={() => toggleImportance(note)}>
          {note.content} 
          <strong> {note.important ? 'important' : 'not important'}</strong>
        </li>
      )}
    </div>
  )
}

export default App