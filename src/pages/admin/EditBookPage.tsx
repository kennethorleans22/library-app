import { useRef, useState, type FormEvent } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useBookDetail } from '@/features/books/useBookDetail'
import { useCategoryOptions } from '@/features/admin/useCategoryOptions'
import { useUpdateBook } from '@/features/admin/useUpdateBook'
import type { Book } from '@/types'

function EditBookPage() {
  const { id } = useParams<{ id: string }>()
  const { data, isLoading, isError, error } = useBookDetail(id)

  if (isLoading) return <p className="text-body-md text-neutral-500">Memuat...</p>
  if (isError) return <p className="text-body-md text-danger">Error: {error.message}</p>
  if (!data) return null

  // form dipisah ke komponen sendiri supaya nilai awal diisi dari data (tanpa useEffect)
  return <EditBookForm book={data.data} />
}

function EditBookForm({ book }: { book: Book }) {
  const navigate = useNavigate()
  const { data: catData } = useCategoryOptions()
  const categories = catData?.data.categories ?? []
  const updateBook = useUpdateBook()

  const [title, setTitle] = useState(book.title)
  const [author, setAuthor] = useState(book.author.name)
  const [categoryId, setCategoryId] = useState(String(book.categoryId))
  const [pages, setPages] = useState('')
  const [description, setDescription] = useState(book.description)
  const [newCover, setNewCover] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState<string>(book.coverImage)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const fileRef = useRef<HTMLInputElement>(null)

  const inputClass = (err?: string) =>
    `h-12 w-full rounded-xl border px-4 text-body-md font-semibold text-neutral-950 outline-none focus:border-primary-500 ${
      err ? 'border-danger' : 'border-neutral-300'
    }`

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    if (f.size > 5 * 1024 * 1024) {
      setErrors((p) => ({ ...p, cover: 'Ukuran maksimal 5mb' }))
      return
    }
    setErrors((p) => ({ ...p, cover: '' }))
    setNewCover(f)
    setCoverPreview(URL.createObjectURL(f))
  }

  const handleDeleteImage = () => {
    setNewCover(null)
    setCoverPreview('')
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const err: Record<string, string> = {}
    if (!title.trim()) err.title = 'Title wajib diisi'
    if (!author.trim()) err.author = 'Author wajib diisi'
    if (!categoryId) err.category = 'Pilih kategori'
    if (!description.trim()) err.description = 'Description wajib diisi'
    setErrors(err)
    if (Object.keys(err).length > 0) return

    const fd = new FormData()
    fd.append('title', title)
    fd.append('authorName', author)
    fd.append('categoryId', categoryId)
    if (pages.trim()) fd.append('pages', pages)
    fd.append('description', description)
    if (newCover) fd.append('coverImage', newCover) // kirim HANYA kalau ganti gambar

    updateBook.mutate(
      { id: book.id, formData: fd },
      {
        onSuccess: () => navigate('/admin/books', { state: { toast: 'Edit Success' } }),
        onError: (e: Error) => setErrors((p) => ({ ...p, form: e.message })),
      }
    )
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto flex w-full max-w-132.25 flex-col gap-4 tracking-[-0.02em]">
      {/* Header */}
      <button type="button" onClick={() => navigate('/admin/books')} className="flex w-fit items-center gap-1.5 lg:gap-3">
        <img src="/icons/arrow-left.svg" alt="Back" className="h-6 w-6 lg:h-8 lg:w-8" />
        <span className="text-body-xl font-bold text-neutral-950 lg:text-display-xs">Edit Book</span>
      </button>

      {/* Title */}
      <div className="flex flex-col gap-0.5">
        <label className="text-body-sm font-bold text-neutral-950">Title</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass(errors.title)} />
        {errors.title && <p className="text-body-sm font-medium text-danger">{errors.title}</p>}
      </div>

      {/* Author */}
      <div className="flex flex-col gap-0.5">
        <label className="text-body-sm font-bold text-neutral-950">Author</label>
        <input value={author} onChange={(e) => setAuthor(e.target.value)} className={inputClass(errors.author)} />
        {errors.author && <p className="text-body-sm font-medium text-danger">{errors.author}</p>}
      </div>

      {/* Category */}
      <div className="flex flex-col gap-0.5">
        <label className="text-body-sm font-bold text-neutral-950">Category</label>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className={`${inputClass(errors.category)} ${categoryId ? '' : 'text-neutral-500'}`}
        >
          <option value="" disabled>Select Category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id} className="text-neutral-950">{c.name}</option>
          ))}
        </select>
        {errors.category && <p className="text-body-sm font-medium text-danger">{errors.category}</p>}
      </div>

      {/* Number of Pages */}
      <div className="flex flex-col gap-0.5">
        <label className="text-body-sm font-bold text-neutral-950">Number of Pages</label>
        <input type="number" value={pages} onChange={(e) => setPages(e.target.value)} className={inputClass()} />
      </div>

      {/* Description */}
      <div className="flex flex-col gap-0.5">
        <label className="text-body-sm font-bold text-neutral-950">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={`h-25 w-full resize-none rounded-xl border px-4 py-2 text-body-md font-semibold text-neutral-950 outline-none focus:border-primary-500 lg:h-40 ${
            errors.description ? 'border-danger' : 'border-neutral-300'
          }`}
        />
        {errors.description && <p className="text-body-sm font-medium text-danger">{errors.description}</p>}
      </div>

      {/* Cover Image */}
      <div className="flex flex-col gap-0.5">
        <label className="text-body-sm font-bold text-neutral-950">Cover Image</label>
        <input ref={fileRef} type="file" accept="image/png,image/jpeg" className="hidden" onChange={handleFile} />

        {!coverPreview ? (
          <div
            onClick={() => fileRef.current?.click()}
            className={`flex cursor-pointer flex-col items-center gap-3 rounded-xl border border-dashed px-6 py-4 ${
              errors.cover ? 'border-danger' : 'border-neutral-300'
            }`}
          >
            <span className="flex size-10 items-center justify-center rounded-md border border-neutral-300">
              <img src="/icons/upload-cloud.svg" alt="" className="size-5" />
            </span>
            <div className="flex flex-col items-center gap-1">
              <p className="text-body-sm font-semibold text-neutral-950">
                <span className="text-primary-500">Click to upload</span> or drag and drop
              </p>
              <p className="text-body-sm font-semibold text-neutral-950">PNG or JPG (max. 5mb)</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-neutral-300 px-6 py-4">
            <img src={coverPreview} alt="cover" className="h-34.5 w-23 object-cover" />
            <div className="flex gap-3">
              <button type="button" onClick={() => fileRef.current?.click()} className="flex h-10 items-center justify-center gap-1.5 rounded-full border border-neutral-300 px-4 text-body-sm font-bold text-neutral-950">
                <img src="/icons/upload.svg" alt="" className="h-5 w-5" />
                Change Image
              </button>
              <button type="button" onClick={handleDeleteImage} className="flex h-10 items-center justify-center gap-1.5 rounded-full border border-neutral-300 px-4 text-body-sm font-bold text-danger">
                <img src="/icons/trash.svg" alt="" className="h-5 w-5" />
                Delete Image
              </button>
            </div>
            <p className="text-body-sm font-semibold text-neutral-950">PNG or JPG (max. 5mb)</p>
          </div>
        )}
        {errors.cover && <p className="text-body-sm font-medium text-danger">{errors.cover}</p>}
      </div>

      {errors.form && <p className="text-body-sm font-medium text-danger">{errors.form}</p>}

      {/* Save */}
      <button
        type="submit"
        disabled={updateBook.isPending}
        className="flex h-12 w-full items-center justify-center rounded-full bg-primary-500 text-body-md font-bold text-neutral-25 disabled:opacity-60"
      >
        {updateBook.isPending ? 'Saving...' : 'Save'}
      </button>
    </form>
  )
}

export default EditBookPage