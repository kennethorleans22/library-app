import { useRef, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCategoryOptions } from '@/features/admin/useCategoryOptions';
import { useCreateBook } from '@/features/admin/useCreateBook';

function AddBookPage() {
  const navigate = useNavigate();
  const { data: catData } = useCategoryOptions();
  const categories = catData?.data.categories ?? [];
  const createBook = useCreateBook();

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [pages, setPages] = useState('');
  const [description, setDescription] = useState('');
  const [cover, setCover] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const fileRef = useRef<HTMLInputElement>(null);
  const coverUrl = cover ? URL.createObjectURL(cover) : null;

  const inputClass = (err?: string) =>
    `h-12 w-full rounded-xl border px-4 text-body-md font-semibold text-neutral-950 outline-none focus:border-primary-500 ${
      err ? 'border-danger' : 'border-neutral-300'
    }`;

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) {
      setErrors((p) => ({ ...p, cover: 'Ukuran maksimal 5mb' }));
      return;
    }
    setErrors((p) => ({ ...p, cover: '' }));
    setCover(f);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const err: Record<string, string> = {};
    if (!title.trim()) err.title = 'Title must be filled';
    if (!author.trim()) err.author = 'Author must be filled';
    if (!categoryId) err.category = 'Choose category';
    if (!pages.trim()) err.pages = 'Number of Pages must be filled';
    if (!description.trim()) err.description = 'Description must be filled';
    if (!cover) err.cover = 'Cover image must be uploaded';
    setErrors(err);
    if (Object.keys(err).length > 0) return;

    const fd = new FormData();
    fd.append('title', title);
    fd.append('authorName', author);
    fd.append('categoryId', categoryId);
    fd.append('pages', pages);
    fd.append('description', description);
    fd.append('isbn', Date.now().toString()); // API wajib isbn; form tak punya → generate
    if (cover) fd.append('coverImage', cover);

    createBook.mutate(fd, {
      onSuccess: () =>
        navigate('/admin/books', { state: { toast: 'Add Success' } }),
      onError: (e: Error) => setErrors((p) => ({ ...p, form: e.message })),
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='mx-auto flex w-full max-w-132.25 flex-col gap-4 tracking-[-0.02em]'
    >
      {/* Header */}
      <button
        type='button'
        onClick={() => navigate('/admin/books')}
        className='flex w-fit items-center gap-1.5 lg:gap-3'
      >
        <img
          src='/icons/arrow-left.svg'
          alt='Back'
          className='h-6 w-6 lg:h-8 lg:w-8'
        />
        <span className='text-body-xl font-bold text-neutral-950 lg:text-display-xs'>
          Add Book
        </span>
      </button>

      {/* Title */}
      <div className='flex flex-col gap-0.5'>
        <label className='text-body-sm font-bold text-neutral-950'>Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={inputClass(errors.title)}
        />
        {errors.title && (
          <p className='text-body-sm font-medium text-danger'>{errors.title}</p>
        )}
      </div>

      {/* Author */}
      <div className='flex flex-col gap-0.5'>
        <label className='text-body-sm font-bold text-neutral-950'>
          Author
        </label>
        <input
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className={inputClass(errors.author)}
        />
        {errors.author && (
          <p className='text-body-sm font-medium text-danger'>
            {errors.author}
          </p>
        )}
      </div>

      {/* Category */}
      <div className='flex flex-col gap-0.5'>
        <label className='text-body-sm font-bold text-neutral-950'>
          Category
        </label>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className={`${inputClass(errors.category)} ${categoryId ? '' : 'text-neutral-500'}`}
        >
          <option value='' disabled>
            Select Category
          </option>
          {categories.map((c) => (
            <option key={c.id} value={c.id} className='text-neutral-950'>
              {c.name}
            </option>
          ))}
        </select>
        {errors.category && (
          <p className='text-body-sm font-medium text-danger'>
            {errors.category}
          </p>
        )}
      </div>

      {/* Number of Pages */}
      <div className='flex flex-col gap-0.5'>
        <label className='text-body-sm font-bold text-neutral-950'>
          Number of Pages
        </label>
        <input
          type='number'
          value={pages}
          onChange={(e) => setPages(e.target.value)}
          className={inputClass(errors.pages)}
        />
        {errors.pages && (
          <p className='text-body-sm font-medium text-danger'>{errors.pages}</p>
        )}
      </div>

      {/* Description */}
      <div className='flex flex-col gap-0.5'>
        <label className='text-body-sm font-bold text-neutral-950'>
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={`h-25 w-full resize-none rounded-xl border px-4 py-2 text-body-md font-semibold text-neutral-950 outline-none focus:border-primary-500 lg:h-40 ${
            errors.description ? 'border-danger' : 'border-neutral-300'
          }`}
        />
        {errors.description && (
          <p className='text-body-sm font-medium text-danger'>
            {errors.description}
          </p>
        )}
      </div>

      {/* Cover Image */}
      <div className='flex flex-col gap-0.5'>
        <label className='text-body-sm font-bold text-neutral-950'>
          Cover Image
        </label>
        <input
          ref={fileRef}
          type='file'
          accept='image/png,image/jpeg'
          className='hidden'
          onChange={handleFile}
        />

        {!cover ? (
          <div
            onClick={() => fileRef.current?.click()}
            className={`flex cursor-pointer flex-col items-center gap-3 rounded-xl border border-dashed px-6 py-4 ${
              errors.cover ? 'border-danger' : 'border-neutral-300'
            }`}
          >
            <span className='flex size-10 items-center justify-center rounded-md border border-neutral-300'>
              <img src='/icons/upload-cloud.svg' alt='' className='size-5' />
            </span>
            <div className='flex flex-col items-center gap-1'>
              <p className='text-body-sm font-semibold text-neutral-950'>
                <span className='text-primary-500'>Click to upload</span> or
                drag and drop
              </p>
              <p className='text-body-sm font-semibold text-neutral-950'>
                PNG or JPG (max. 5mb)
              </p>
            </div>
          </div>
        ) : (
          <div className='flex flex-col items-center gap-3 rounded-xl border border-dashed border-neutral-300 px-6 py-4'>
            <img
              src={coverUrl!}
              alt='cover'
              className='h-34.5 w-23 object-cover'
            />
            <div className='flex gap-3'>
                          <button type="button" onClick={() => fileRef.current?.click()} className="flex h-10 items-center justify-center gap-1.5 rounded-full border border-neutral-300 px-4 text-body-sm font-bold text-neutral-950">
                <img src="/icons/upload.svg" alt="" className="h-5 w-5" />
                Change Image
              </button>
              <button type="button" onClick={() => setCover(null)} className="flex h-10 items-center justify-center gap-1.5 rounded-full border border-neutral-300 px-4 text-body-sm font-bold text-danger">
                <img src="/icons/trash.svg" alt="" className="h-5 w-5" />
                Delete Image
              </button>
            </div>
            <p className='text-body-sm font-semibold text-neutral-950'>
              PNG or JPG (max. 5mb)
            </p>
          </div>
        )}
        {errors.cover && (
          <p className='text-body-sm font-medium text-danger'>{errors.cover}</p>
        )}
      </div>

      {errors.form && (
        <p className='text-body-sm font-medium text-danger'>{errors.form}</p>
      )}

      {/* Save */}
      <button
        type='submit'
        disabled={createBook.isPending}
        className='flex h-12 w-full items-center justify-center rounded-full bg-primary-500 text-body-md font-bold text-neutral-25 disabled:opacity-60'
      >
        {createBook.isPending ? 'Saving...' : 'Save'}
      </button>
    </form>
  );
}

export default AddBookPage;
